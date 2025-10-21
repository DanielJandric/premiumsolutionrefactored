import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SupabaseDocument {
  path: string;
  name: string;
  size: number;
  updatedAt: string;
  signedUrl: string | null;
}

const LIST_LIMIT = 100;

const SIGNED_URL_TTL_SECONDS = 60 * 30;
const CACHE_TTL_MS = 30_000;

let documentsCache:
  | {
      value: SupabaseDocument[];
      expiresAt: number;
    }
  | null = null;

export async function listSupabaseDocuments(options?: { force?: boolean }) {
  if (
    !options?.force &&
    documentsCache &&
    documentsCache.expiresAt > Date.now()
  ) {
    return documentsCache.value;
  }

  const supabase = createSupabaseServerClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!bucket) {
    throw new Error(
      "SUPABASE_STORAGE_BUCKET n'est pas defini. Ajoutez-le a votre configuration.",
    );
  }

  const bucketName = bucket;

  async function listPath(prefix: string): Promise<SupabaseDocument[]> {
    const { data, error } = await supabase.storage.from(bucketName).list(prefix, {
      limit: LIST_LIMIT,
      sortBy: { column: "updated_at", order: "desc" },
    });

    if (error) {
      throw error;
    }

    const entries: SupabaseDocument[] = [];
    const folders: string[] = [];
    type StorageEntry = NonNullable<typeof data>[number];
    const files: Array<{ storage: StorageEntry; currentPath: string }> = [];

    for (const item of data ?? []) {
      const isFolder =
        !item.metadata ||
        typeof (item.metadata as { size?: number }).size === "undefined";
      const currentPath = prefix ? `${prefix}/${item.name}` : item.name;

      if (isFolder) {
        folders.push(currentPath);
        continue;
      }

      files.push({
        storage: item,
        currentPath,
      });
    }

    if (folders.length > 0) {
      const nestedLists = await Promise.all(
        folders.map(async (folderPath) => listPath(folderPath)),
      );
      for (const nested of nestedLists) {
        entries.push(...nested);
      }
    }

    if (files.length > 0) {
      const signedResults = await Promise.all(
        files.map(async (file) => {
          const { data: signed, error: signedError } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(file.currentPath, SIGNED_URL_TTL_SECONDS);

          if (signedError) {
            throw signedError;
          }

          const sizeMeta = file.storage.metadata as { size?: number } | undefined;

          return {
            path: file.currentPath,
            name: file.storage.name,
            size: Number(sizeMeta?.size ?? 0),
            updatedAt: file.storage.updated_at ?? new Date().toISOString(),
            signedUrl: signed?.signedUrl ?? null,
          } satisfies SupabaseDocument;
        }),
      );

      entries.push(...signedResults);
    }

    return entries;
  }

  const documents = await listPath("");
  const sorted = documents.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  documentsCache = {
    value: sorted,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };

  return sorted;
}

export async function uploadDocumentToSupabase(
  path: string,
  payload: string | Uint8Array | Buffer,
  options?: { contentType?: string },
): Promise<{ signedUrl: string | null }> {
  const supabase = createSupabaseServerClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!bucket) {
    throw new Error(
      "SUPABASE_STORAGE_BUCKET n'est pas defini. Ajoutez-le a votre configuration.",
    );
  }

  const { error } = await supabase.storage.from(bucket).upload(path, payload, {
    upsert: true,
    contentType: options?.contentType ?? "application/json",
  });

  if (error) {
    throw error;
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (signedError) {
    throw signedError;
  }

  return { signedUrl: signed?.signedUrl ?? null };
}

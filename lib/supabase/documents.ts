import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SupabaseDocument {
  path: string;
  name: string;
  size: number;
  updatedAt: string;
  signedUrl: string | null;
}

const LIST_LIMIT = 100;

export async function listSupabaseDocuments() {
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

    for (const item of data ?? []) {
      const isFolder =
        !item.metadata ||
        typeof (item.metadata as { size?: number }).size === "undefined";
      const currentPath = prefix ? `${prefix}/${item.name}` : item.name;

      if (isFolder) {
        const nested = await listPath(currentPath);
        entries.push(...nested);
        continue;
      }

      const { data: signed, error: signedError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(currentPath, 60 * 30);

      if (signedError) {
        throw signedError;
      }

      entries.push({
        path: currentPath,
        name: item.name,
        size: Number((item.metadata as { size?: number })?.size ?? 0),
        updatedAt: item.updated_at ?? new Date().toISOString(),
        signedUrl: signed?.signedUrl ?? null,
      });
    }

    return entries;
  }

  const documents = await listPath("");
  return documents.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function uploadDocumentToSupabase(
  path: string,
  payload: string | Uint8Array | Buffer,
  options?: { contentType?: string },
) {
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
}

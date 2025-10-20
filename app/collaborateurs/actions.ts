"use server";

import { redirect } from "next/navigation";
import {
  clearCollaboratorSession,
  createCollaboratorSession,
} from "@/lib/auth/collaborator";

interface LoginState {
  error?: string;
}

export async function authenticateCollaboratorAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.trim().length === 0) {
    return { error: "Merci de renseigner le mot de passe collaborateur." };
  }

  const authenticated = await createCollaboratorSession(password.trim());
  if (!authenticated) {
    return { error: "Mot de passe invalide. Merci de réessayer." };
  }

  redirect("/collaborateurs");
}

export async function logoutCollaboratorAction() {
  await clearCollaboratorSession();
  redirect("/collaborateurs/login");
}

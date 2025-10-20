"use client";

import { useActionState } from "react";
import { authenticateCollaboratorAction } from "@/app/collaborateurs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { error: undefined as string | undefined };

export function CollaboratorLoginForm() {
  const [state, formAction, isPending] = useActionState(
    authenticateCollaboratorAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Mot de passe collaborateur
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          required
          autoComplete="current-password"
        />
      </div>

      {state.error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  );
}

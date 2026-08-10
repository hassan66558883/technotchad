"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/(dashboard)/compte/actions";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, undefined);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
    >
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">
          Mot de passe actuel
        </label>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">
          Nouveau mot de passe
        </label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <p className="mt-1 text-xs text-slate/70">Au moins 8 caractères.</p>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate">
          Confirmer le nouveau mot de passe
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Mot de passe mis à jour avec succès.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enregistrement…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}

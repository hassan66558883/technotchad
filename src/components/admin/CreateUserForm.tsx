"use client";

import { useActionState } from "react";
import { createUser } from "@/app/admin/(dashboard)/utilisateurs/actions";
import { ROLES, ROLE_LABELS } from "@/lib/roles";

export default function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(createUser, undefined);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
    >
      <input
        name="name"
        required
        placeholder="Nom complet"
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
      />
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="Mot de passe (8 caractères min.)"
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
      />
      <select
        name="role"
        required
        defaultValue=""
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
      >
        <option value="" disabled>
          Rôle
        </option>
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 sm:col-span-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Création…" : "Ajouter un utilisateur"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/login/actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-cyan"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Mot de passe"
        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-cyan"
      />

      {state?.error && (
        <p className="rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-cyan px-6 py-3 text-sm font-bold text-navy transition-colors hover:bg-cyan/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "CONNEXION…" : "SE CONNECTER"}
      </button>
    </form>
  );
}

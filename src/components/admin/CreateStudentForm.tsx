"use client";

import { useActionState } from "react";
import { createStudent } from "@/app/admin/(dashboard)/etudiants/actions";

type Option = { value: string; label: string };

export default function CreateStudentForm({ enrollmentOptions }: { enrollmentOptions: Option[] }) {
  const [state, formAction, isPending] = useActionState(createStudent, undefined);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
    >
      <input
        name="firstName"
        required
        placeholder="Prénom"
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
      />
      <input
        name="lastName"
        required
        placeholder="Nom"
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
      />
      <input
        name="phone"
        required
        placeholder="Téléphone"
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
      />
      <select
        name="enrollment"
        defaultValue=""
        className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
      >
        <option value="">Aucune inscription pour le moment</option>
        {enrollmentOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
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
        {isPending ? "Ajout…" : "Ajouter un étudiant"}
      </button>
    </form>
  );
}

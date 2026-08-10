"use client";

import { useActionState } from "react";
import { createStudent } from "@/app/admin/(dashboard)/etudiants/actions";

type Option = { value: string; label: string };

const inputClass =
  "rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue";

export default function CreateStudentForm({ enrollmentOptions }: { enrollmentOptions: Option[] }) {
  const [state, formAction, isPending] = useActionState(createStudent, undefined);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-line bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-sm font-semibold text-navy">Fiche d&apos;inscription étudiant</h2>
        <p className="mt-1 text-xs text-slate">
          Seuls le prénom, le nom, le téléphone et l&apos;email sont obligatoires — le reste
          alimente la fiche imprimable une fois complété.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          1. Informations personnelles
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input name="firstName" required placeholder="Prénom" className={inputClass} />
          <input name="lastName" required placeholder="Nom" className={inputClass} />
          <input name="phone" required placeholder="Téléphone" className={inputClass} />
          <input name="email" type="email" required placeholder="Email" className={inputClass} />
          <input name="dateOfBirth" type="date" aria-label="Date de naissance" className={inputClass} />
          <input name="placeOfBirth" placeholder="Lieu de naissance" className={inputClass} />
          <select name="gender" defaultValue="" className={inputClass}>
            <option value="">Sexe</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          <input
            name="address"
            placeholder="Adresse"
            className={`${inputClass} sm:col-span-2`}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          2. Informations académiques / professionnelles
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select name="educationLevel" defaultValue="" className={inputClass}>
            <option value="">Niveau d&apos;études</option>
            <option value="Primaire">Primaire</option>
            <option value="Secondaire">Secondaire</option>
            <option value="Bac">Bac</option>
            <option value="Licence">Licence</option>
            <option value="Master">Master</option>
            <option value="Autre">Autre</option>
          </select>
          <input name="lastDiploma" placeholder="Dernier diplôme obtenu" className={inputClass} />
          <input name="institution" placeholder="Établissement" className={inputClass} />
          <input name="profession" placeholder="Profession actuelle" className={inputClass} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          3. Formation choisie
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select
            name="enrollment"
            defaultValue=""
            className={`${inputClass} sm:col-span-2`}
          >
            <option value="">Aucune inscription pour le moment</option>
            {enrollmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select name="level" defaultValue="" className={`${inputClass} sm:col-span-2`}>
            <option value="">Niveau</option>
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
          </select>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          4. Logistique & paiement
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select name="trainingMode" defaultValue="" className={`${inputClass} sm:col-span-2`}>
            <option value="">Mode de formation</option>
            <option value="Présentiel">Présentiel</option>
            <option value="En ligne">En ligne</option>
            <option value="Hybride">Hybride</option>
          </select>
          <input
            name="paymentAmount"
            type="number"
            min="0"
            placeholder="Montant total (FCFA)"
            className={inputClass}
          />
          <input
            name="paidAmount"
            type="number"
            min="0"
            placeholder="Montant payé (FCFA)"
            className={inputClass}
          />
          <select name="paymentMethod" defaultValue="" className={inputClass}>
            <option value="">Mode de paiement</option>
            <option value="Espèces">Espèces</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Virement bancaire">Virement bancaire</option>
            <option value="Chèque">Chèque</option>
          </select>
          <input
            name="documentsProvided"
            placeholder="Pièces fournies (ex : CNI, photo, diplôme)"
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          5. Personne à contacter en cas d&apos;urgence
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input name="emergencyContactName" placeholder="Nom complet" className={inputClass} />
          <input name="emergencyContactRelation" placeholder="Lien de parenté" className={inputClass} />
          <input name="emergencyContactPhone" placeholder="Téléphone" className={inputClass} />
        </div>
      </section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enregistrement…" : "Enregistrer la fiche"}
      </button>
    </form>
  );
}

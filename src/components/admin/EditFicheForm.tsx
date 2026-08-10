"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateFiche } from "@/app/admin/(dashboard)/etudiants/actions";

const inputClass =
  "rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue";

const MAX_DISCOUNT_PERCENT = 20;
const MAX_SCHOLARSHIP_PERCENT = 100;

function toDateInputValue(value: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

type Props = {
  registrationId: string;
  student: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dateOfBirth: Date | null;
    placeOfBirth: string | null;
    gender: string | null;
    address: string | null;
    educationLevel: string | null;
    lastDiploma: string | null;
    institution: string | null;
    profession: string | null;
    emergencyContactName: string | null;
    emergencyContactRelation: string | null;
    emergencyContactPhone: string | null;
  };
  registration: {
    level: string | null;
    trainingMode: string | null;
    discountPercent: number | null;
    scholarshipPercent: number | null;
    paymentAmount: number | null;
    paymentMethod: string | null;
    documentsProvided: string | null;
  };
};

export default function EditFicheForm({ registrationId, student, registration }: Props) {
  const action = updateFiche.bind(null, registrationId);
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-line bg-white p-6 shadow-sm">
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          1. Informations personnelles
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input name="firstName" required defaultValue={student.firstName} placeholder="Prénom" className={inputClass} />
          <input name="lastName" required defaultValue={student.lastName} placeholder="Nom" className={inputClass} />
          <input name="phone" required defaultValue={student.phone} placeholder="Téléphone" className={inputClass} />
          <input name="email" type="email" required defaultValue={student.email} placeholder="Email" className={inputClass} />
          <input
            name="dateOfBirth"
            type="date"
            aria-label="Date de naissance"
            defaultValue={toDateInputValue(student.dateOfBirth)}
            className={inputClass}
          />
          <input name="placeOfBirth" defaultValue={student.placeOfBirth ?? ""} placeholder="Lieu de naissance" className={inputClass} />
          <select name="gender" defaultValue={student.gender ?? ""} className={inputClass}>
            <option value="">Sexe</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          <input
            name="address"
            defaultValue={student.address ?? ""}
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
          <select name="educationLevel" defaultValue={student.educationLevel ?? ""} className={inputClass}>
            <option value="">Niveau d&apos;études</option>
            <option value="Primaire">Primaire</option>
            <option value="Secondaire">Secondaire</option>
            <option value="Bac">Bac</option>
            <option value="Licence">Licence</option>
            <option value="Master">Master</option>
            <option value="Autre">Autre</option>
          </select>
          <input name="lastDiploma" defaultValue={student.lastDiploma ?? ""} placeholder="Dernier diplôme obtenu" className={inputClass} />
          <input name="institution" defaultValue={student.institution ?? ""} placeholder="Établissement" className={inputClass} />
          <input name="profession" defaultValue={student.profession ?? ""} placeholder="Profession actuelle" className={inputClass} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          3. Formation choisie
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select name="level" defaultValue={registration.level ?? ""} className={`${inputClass} sm:col-span-2`}>
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
          <select name="trainingMode" defaultValue={registration.trainingMode ?? ""} className={`${inputClass} sm:col-span-2`}>
            <option value="">Mode de formation</option>
            <option value="Présentiel">Présentiel</option>
            <option value="En ligne">En ligne</option>
            <option value="Hybride">Hybride</option>
          </select>
          <input
            name="discountPercent"
            type="number"
            min="0"
            max={MAX_DISCOUNT_PERCENT}
            defaultValue={registration.discountPercent ?? ""}
            placeholder={`Remise (% — max ${MAX_DISCOUNT_PERCENT})`}
            className={inputClass}
          />
          <input
            name="scholarshipPercent"
            type="number"
            min="0"
            max={MAX_SCHOLARSHIP_PERCENT}
            defaultValue={registration.scholarshipPercent ?? ""}
            placeholder="Bourse (%)"
            className={inputClass}
          />
          <input
            name="paymentAmount"
            type="number"
            min="0"
            defaultValue={registration.paymentAmount ?? ""}
            placeholder="Montant total (FCFA)"
            className={inputClass}
          />
          <select name="paymentMethod" defaultValue={registration.paymentMethod ?? ""} className={inputClass}>
            <option value="">Mode de paiement</option>
            <option value="Espèces">Espèces</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Virement bancaire">Virement bancaire</option>
            <option value="Chèque">Chèque</option>
          </select>
          <input
            name="documentsProvided"
            defaultValue={registration.documentsProvided ?? ""}
            placeholder="Pièces fournies (ex : CNI, photo, diplôme)"
            className={inputClass}
          />
        </div>
        <p className="text-xs text-slate">
          Le montant payé se calcule à partir des paiements enregistrés —{" "}
          <Link href="/admin/paiements" className="font-semibold text-blue hover:text-blue-dark">
            gérer les paiements →
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          5. Personne à contacter en cas d&apos;urgence
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input name="emergencyContactName" defaultValue={student.emergencyContactName ?? ""} placeholder="Nom complet" className={inputClass} />
          <input name="emergencyContactRelation" defaultValue={student.emergencyContactRelation ?? ""} placeholder="Lien de parenté" className={inputClass} />
          <input name="emergencyContactPhone" defaultValue={student.emergencyContactPhone ?? ""} placeholder="Téléphone" className={inputClass} />
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
        {isPending ? "Enregistrement…" : "Enregistrer les modifications"}
      </button>
    </form>
  );
}

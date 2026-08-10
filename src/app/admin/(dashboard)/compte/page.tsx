import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export const metadata = { title: "Mon compte — Admin TechnoTchad" };

export default function ComptePage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Mon compte</h1>
        <p className="text-sm text-slate">Changez votre mot de passe de connexion.</p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}

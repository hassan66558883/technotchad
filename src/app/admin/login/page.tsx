import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Connexion — Admin TechnoTchad" };
// Every other /admin/* page is force-dynamic. This one was left as static,
// which let Hostinger's CDN cache it for up to a year (s-maxage default)
// with no invalidation on deploy — after any redeploy it kept serving old
// HTML referencing JS chunk files the new build had already deleted,
// breaking client-side navigation to/from the login page.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="text-center">
          <Image
            src="/logo-mark-light.png"
            alt="TechnoTchad"
            width={400}
            height={582}
            className="mx-auto h-12 w-auto"
          />
          <h1 className="mt-4 text-lg font-bold text-white">TECHNOTCHAD ADMIN</h1>
          <p className="mt-1 text-sm text-white/60">
            Connectez-vous pour accéder au tableau de bord.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

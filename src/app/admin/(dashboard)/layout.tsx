import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { hasAnyAdminAccess } from "@/lib/permissions";

export const metadata = {
  title: "Admin — TechnoTchad",
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    redirect("/admin/login");
  }
  if (!hasAnyAdminAccess(session.role)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-mist">
      <AdminSidebar role={session.role} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar name={session.name} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminPanel from "./AdminPanel";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/kirish");
  }

  if (!session.isAdmin) {
    redirect("/");
  }

  return <AdminPanel />;
}

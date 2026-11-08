import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured } from "@/lib/auth";
import { isAuthenticated } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  return <LoginForm configured={adminConfigured()} />;
}

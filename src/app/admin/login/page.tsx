import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Recitation Points · 2nd Term, SY 2026-2027</p>
        <LoginForm />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { getRoster } from "@/lib/admin-data";
import { requireAdminPage } from "@/lib/session";
import { AdminBoard } from "./admin-board";

export const metadata: Metadata = { title: "Admin · Recitation Points" };

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdminPage();
  const [roster, { s }] = await Promise.all([getRoster(), searchParams]);
  const initial = typeof s === "string" && roster.some((r) => r.slug === s) ? s : roster[0]?.slug;
  return <AdminBoard roster={roster} initialSlug={initial ?? ""} />;
}

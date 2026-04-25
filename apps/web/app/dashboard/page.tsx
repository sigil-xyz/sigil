import { AppShell } from "@/components/app/AppShell";
import { DashboardView } from "./_components/DashboardView";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage your issued Sigil credentials. View active authorizations, monitor agent spend, and revoke access — all from a single principal dashboard.",
  openGraph: {
    title: "Principal Dashboard — Sigil",
    description:
      "Manage your issued Sigil credentials. View active authorizations, monitor agent spend, and revoke access.",
  },
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  );
}

import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { SigilDetailView } from "./_components/SigilDetailView";
import { MOCK_SIGILS } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MOCK_SIGILS.map((s) => ({ id: s.id }));
}

export default async function SigilDetailPage({ params }: Props) {
  const { id } = await params;
  const sigil = MOCK_SIGILS.find((s) => s.id === id);
  if (!sigil) notFound();

  return (
    <AppShell>
      <SigilDetailView sigil={sigil} />
    </AppShell>
  );
}

import { auth } from "@/lib/auth/auth.config";
import { AppShell } from "@/components/features/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user
    ? { name: session.user.name ?? null, image: session.user.image ?? null }
    : null;

  return <AppShell user={user}>{children}</AppShell>;
}

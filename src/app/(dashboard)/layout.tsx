import { auth } from "@/lib/auth/auth.config";
import { gamificationRepository } from "@/lib/db/gamification.repository";
import { AppShell } from "@/components/features/AppShell";
import { DailyRewardHandler } from "@/components/features/DailyRewardHandler";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user
    ? { name: session.user.name ?? null, image: session.user.image ?? null }
    : null;

  const dailyReward = session?.user?.id
    ? await gamificationRepository.claimDailyReward(session.user.id)
    : null;

  const coins = session?.user?.id
    ? (await gamificationRepository.findByUser(session.user.id)).coins
    : 0;

  return (
    <AppShell user={user} coins={coins}>
      {children}
      <DailyRewardHandler dailyReward={dailyReward} />
    </AppShell>
  );
}

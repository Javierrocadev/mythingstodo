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

  const [coins, dailyReward] = session?.user?.id
    ? await Promise.all([
        gamificationRepository.findByUser(session.user.id).then((g) => g.coins),
        gamificationRepository.claimDailyReward(session.user.id),
      ])
    : [0, null];

  return (
    <AppShell user={user} coins={coins}>
      {children}
      <DailyRewardHandler dailyReward={dailyReward} />
    </AppShell>
  );
}

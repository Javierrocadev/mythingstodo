import { auth } from "@/lib/auth/auth.config";
import { gamificationRepository } from "@/lib/db/gamification.repository";
import { prisma } from "@/lib/db/prisma";
import { AppShell } from "@/components/features/AppShell";
import { DailyRewardHandler } from "@/components/features/DailyRewardHandler";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userRecord = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true },
  });

  if (userRecord && !userRecord.onboardingCompleted) {
    redirect("/onboarding");
  }

  const user = { name: session.user.name ?? null, image: session.user.image ?? null };

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

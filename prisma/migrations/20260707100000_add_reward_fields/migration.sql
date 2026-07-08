-- AlterTable
ALTER TABLE "GamificationState" ADD COLUMN "lastRewardDate" TIMESTAMP(3);
ALTER TABLE "GamificationState" ADD COLUMN "totalCompleted" INTEGER NOT NULL DEFAULT 0;

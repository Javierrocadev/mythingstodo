import { auth, signOut } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import { statsRepository } from "@/lib/db/stats.repository";
import { WeeklyEarningsBars } from "@/components/features/WeeklyEarningsBars";
import { TrophyMilestones } from "@/components/features/TrophyMilestones";

const URGENCY_LABEL: Record<string, string> = {
  NOW: "Urgente",
  TODAY: "Hoy",
  MARGIN: "Con margen",
};

const EMOTION_LABEL: Record<string, string> = {
  SATISFYING: "Satisfactorias",
  NORMAL: "Normales",
  BORING: "Aburridas",
  DRAINING: "Agotadoras",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [stats, weeklyEarnings] = await Promise.all([
    statsRepository.getSummary(session.user.id),
    statsRepository.getWeeklyEarnings(session.user.id),
  ]);

  return (
    <div className="flex flex-col gap-6 py-6">
      <h2 className="font-display text-xl font-bold">Ajustes</h2>

      <div className="flex items-center gap-3 rounded-xl border border-border p-4">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? ""}
            className="h-10 w-10 rounded-full"
          />
        ) : null}
        <div>
          <p className="font-medium">{session.user?.name}</p>
          <p className="text-muted-foreground text-sm">{session.user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <section>
        <h3 className="font-display mb-3 text-lg font-bold">Estadísticas</h3>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <StatCard label="Completadas" value={stats.totalCompleted} emoji="✅" />
          <StatCard label="XP total" value={stats.xp} emoji="⭐" />
          <StatCard label="Nivel" value={stats.level} emoji="🏆" />
          <StatCard label="Monedas" value={stats.coins} emoji="🪙" />
          <StatCard label="Racha actual" value={`${stats.currentStreak} días`} emoji="🔥" />
          <StatCard label="Mejor racha" value={`${stats.longestStreak} días`} emoji="💪" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
              Monedas ganadas
            </p>
            <p className="font-display text-lg font-bold text-emerald-600">
              +{stats.coinsEarned}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
              Monedas gastadas
            </p>
            <p className="font-display text-lg font-bold text-rose-600">
              -{stats.coinsSpent}
            </p>
          </div>
        </div>

        {stats.tasksByUrgency.length > 0 && (
          <div className="mt-4 rounded-xl border border-border p-4">
            <p className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
              Completadas por urgencia
            </p>
            <div className="flex flex-col gap-2">
              {stats.tasksByUrgency.map((t) => (
                <StatBar
                  key={t.urgency}
                  label={URGENCY_LABEL[t.urgency] ?? t.urgency}
                  count={t.count}
                  max={stats.tasksByUrgency[0].count}
                  style={URGENCY_ITEM[t.urgency]}
                />
              ))}
            </div>
          </div>
        )}

        {stats.tasksByEmotionalType.length > 0 && (
          <div className="mt-3 rounded-xl border border-border p-4">
            <p className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
              Completadas por tipo emocional
            </p>
            <div className="flex flex-col gap-2">
              {stats.tasksByEmotionalType.map((t) => (
                <StatBar
                  key={t.emotionalType}
                  label={EMOTION_LABEL[t.emotionalType] ?? t.emotionalType}
                  count={t.count}
                  max={stats.tasksByEmotionalType[0].count}
                  style={EMOTION_ITEM[t.emotionalType]}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Weekly earnings */}
      <section>
        <h3 className="font-display mb-3 text-lg font-bold">Monedas esta semana</h3>
        <WeeklyEarningsBars days={weeklyEarnings} />
      </section>

      {/* Milestones */}
      <section>
        <h3 className="font-display mb-3 text-lg font-bold">Trofeos</h3>
        <TrophyMilestones totalCompleted={stats.totalCompleted} />
      </section>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="w-full rounded-xl border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

const URGENCY_ITEM: Record<string, { color: string; bar: string; emoji: string }> = {
  NOW: { color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30 ring-rose-200/60 dark:ring-rose-800/40", bar: "bg-rose-400", emoji: "🔴" },
  TODAY: { color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 ring-amber-200/60 dark:ring-amber-800/40", bar: "bg-amber-400", emoji: "🟡" },
  MARGIN: { color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-200/60 dark:ring-emerald-800/40", bar: "bg-emerald-400", emoji: "🟢" },
};

const EMOTION_ITEM: Record<string, { color: string; bar: string; emoji: string }> = {
  SATISFYING: { color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-200/60 dark:ring-emerald-800/40", bar: "bg-emerald-400", emoji: "😊" },
  NORMAL: { color: "text-sky-600 bg-sky-50 dark:bg-sky-950/30 ring-sky-200/60 dark:ring-sky-800/40", bar: "bg-sky-400", emoji: "😐" },
  BORING: { color: "text-stone-600 bg-stone-50 dark:bg-stone-950/30 ring-stone-200/60 dark:ring-stone-800/40", bar: "bg-stone-400", emoji: "😴" },
  DRAINING: { color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 ring-violet-200/60 dark:ring-violet-800/40", bar: "bg-violet-400", emoji: "😫" },
};

function StatBar({
  label,
  count,
  max,
  style,
}: {
  label: string;
  count: number;
  max: number;
  style: { bar: string; emoji: string; color: string };
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ring-1 transition-all ${style.color}`}>
      <span className="text-lg">{style.emoji}</span>
      <span className="min-w-28 text-sm font-medium">{label}</span>
      <div className="flex flex-1 items-center gap-3">
        <div className="bg-muted/50 h-3 flex-1 overflow-hidden rounded-full">
          <div
            className={`${style.bar} h-full rounded-full transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-display flex h-7 min-w-[2rem] items-center justify-center rounded-md bg-background px-2 text-sm font-bold tabular-nums shadow-sm ring-1 ring-border/50">
          {count}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string | number;
  emoji: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-1 text-lg">{emoji}</div>
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="font-display mt-0.5 text-xl font-bold">{value}</p>
    </div>
  );
}

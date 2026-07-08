import { auth, signOut } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import { statsRepository } from "@/lib/db/stats.repository";

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

  const stats = await statsRepository.getSummary(session.user.id);

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
            <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
              Completadas por urgencia
            </p>
            <div className="flex flex-col gap-2">
              {stats.tasksByUrgency.map((t) => (
                <div key={t.urgency} className="flex items-center justify-between">
                  <span className="text-sm">{URGENCY_LABEL[t.urgency] ?? t.urgency}</span>
                  <span className="font-display text-sm font-bold">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.tasksByEmotionalType.length > 0 && (
          <div className="mt-3 rounded-xl border border-border p-4">
            <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
              Completadas por tipo emocional
            </p>
            <div className="flex flex-col gap-2">
              {stats.tasksByEmotionalType.map((t) => (
                <div key={t.emotionalType} className="flex items-center justify-between">
                  <span className="text-sm">{EMOTION_LABEL[t.emotionalType] ?? t.emotionalType}</span>
                  <span className="font-display text-sm font-bold">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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

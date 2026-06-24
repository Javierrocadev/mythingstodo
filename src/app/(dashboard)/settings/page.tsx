import { auth, signOut } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

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

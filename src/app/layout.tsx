import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyThingsToDo",
  description: "Gestión de tareas con mascota virtual y gamificación",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--background)",
              border: "0",
              color: "var(--foreground)",
              borderRadius: "var(--radius)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              padding: "14px 18px",
            },
          }}
        />
      </body>
    </html>
  );
}

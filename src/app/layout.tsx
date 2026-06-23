import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyThingsToDo",
  description: "Gestión de tareas con mascota virtual y gamificación",
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
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            },
          }}
        />
      </body>
    </html>
  );
}

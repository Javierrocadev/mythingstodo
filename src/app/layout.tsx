import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

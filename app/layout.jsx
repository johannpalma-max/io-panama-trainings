import "./globals.css";
import { getSettings } from "@/lib/db";

export const metadata = {
  title: "EO Panamá · Trainings para Foros",
  description: "Entrenamientos y conferencias dedicados a los foros del capítulo de Panamá.",
};

export default async function RootLayout({ children }) {
  const s = await getSettings();
  const cssVars = `:root{--brand-primary:${s.brandPrimary};--brand-accent:${s.brandAccent};--brand-bg:${s.brandBg};}`;
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

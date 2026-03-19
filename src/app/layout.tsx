import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlyDeals — Billige flyreiser. Funnet for deg.",
  description: "FlyDeals overvåker flypriser fra norske flyplasser og varsler deg når prisene faller. Spar opptil 90% på din neste reise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" style={{ background: '#050505' }}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/css/flag-icons.min.css" />
      </head>
      <body style={{ background: '#050505', color: '#f0f0f0' }}>
        {children}
      </body>
    </html>
  );
}

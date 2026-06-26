import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sigma Dialer - Onboarding",
  description: "Cloud contact-center platform for teams who actually hit the phones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

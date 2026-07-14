import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoreSignal – AI App Store Intelligence for Publishers",
  description: "AI-powered app store intelligence platform for Google Play publishers and indie game studios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

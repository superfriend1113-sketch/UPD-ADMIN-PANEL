import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import Toast from "@/components/ui/Toast";

const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: "--font-display",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  variable: "--font-body",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Admin Panel',
    default: 'Admin Panel | Unlimited Perfect Deals',
  },
  description: "Admin panel for managing deals, categories, and retailers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toast />
      </body>
    </html>
  );
}

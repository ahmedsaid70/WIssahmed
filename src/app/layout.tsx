import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Us",
  description: "A little corner of the internet just for us.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-dvh antialiased`}
    >
      <body className="h-dvh overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <NavBar />
        <div className="flex h-[calc(100dvh-var(--nav-height))] flex-col overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}

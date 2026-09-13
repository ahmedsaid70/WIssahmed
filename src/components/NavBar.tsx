"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Image as ImageIcon, Clock, MessageCircle, LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/guestbook", label: "Notes", icon: MessageCircle },
  { href: "/wissam", label: "Wissam", icon: "👧" },
];

export function NavBar() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/letter") return null;

  return (
    <>
      <form action={logout} className="fixed top-4 right-4 z-30">
        <button
          type="submit"
          aria-label="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white/90 text-neutral-500 shadow-sm backdrop-blur-md transition-colors hover:text-rose-500 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
        </button>
      </form>

      <nav className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
        <ul className="flex items-center gap-1 rounded-full border border-rose-100 bg-white/90 p-1.5 shadow-lg shadow-neutral-900/10 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-label={link.label}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex h-12 w-12 items-center justify-center rounded-full"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-rose-500"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  )}
                  {typeof Icon === "string" ? (
                    <span className="relative text-base leading-none">{Icon}</span>
                  ) : (
                    <Icon
                      className={`relative h-5 w-5 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                      strokeWidth={2}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

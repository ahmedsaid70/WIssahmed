"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <main className="flex min-h-full flex-1 flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100 px-4 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="m-auto w-full max-w-sm rounded-2xl border border-rose-200/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80"
      >
        <h1 className="text-center text-2xl font-semibold text-rose-600 dark:text-rose-400">
          Wissahmed ♥
        </h1>
        <p className="mt-1 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Just for the two of us.
        </p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500" role="alert">
              {state.error}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
          >
            {pending ? "Logging in..." : "Log in"}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}

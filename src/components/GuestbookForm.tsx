"use client";

import { useFormStatus } from "react-dom";
import { addGuestbookMessage } from "@/app/guestbook/actions";
import { FormStatusWatcher } from "@/components/FormStatusWatcher";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
    >
      {pending ? "Posting..." : "Leave a note"}
    </button>
  );
}

export function GuestbookForm() {
  return (
    <form action={addGuestbookMessage} className="flex flex-col gap-3">
      <FormStatusWatcher />
      <textarea
        name="message"
        rows={3}
        required
        placeholder="Write something sweet..."
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-rose-400 dark:border-neutral-700 dark:bg-neutral-800"
      />
      <SubmitButton />
    </form>
  );
}

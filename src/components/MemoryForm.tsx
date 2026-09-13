"use client";

import { useFormStatus } from "react-dom";
import { addMemory } from "@/app/gallery/actions";
import { FormStatusWatcher } from "@/components/FormStatusWatcher";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
    >
      {pending ? "Saving..." : "Add memory"}
    </button>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-rose-400 dark:border-neutral-700 dark:bg-neutral-800";
const labelClass = "text-xs font-medium text-neutral-500";

export function MemoryForm() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={addMemory} className="flex flex-col gap-3">
      <FormStatusWatcher />

      <div>
        <label htmlFor="photo" className={labelClass}>
          Photo (optional)
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-rose-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-rose-600 dark:file:bg-rose-500/10 dark:file:text-rose-400"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-40">
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={today}
            required
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="That perfect evening"
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <input
          type="checkbox"
          name="favorite"
          className="h-4 w-4 rounded border-neutral-300 text-rose-500 focus:ring-rose-400"
        />
        Mark as a favorite
      </label>

      <SubmitButton />
    </form>
  );
}

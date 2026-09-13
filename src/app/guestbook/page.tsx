import { createClient } from "@/lib/supabase/server";
import { GuestbookForm } from "@/components/GuestbookForm";
import { GuestbookList } from "@/components/GuestbookList";
import { AddDialog } from "@/components/AddDialog";

export default async function GuestbookPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("guestbook_messages")
    .select("id, author, message, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold text-rose-600 dark:text-rose-400">
        Notes
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Little things worth writing down.
      </p>

      <AddDialog trigger="Add a note" title="Leave a note">
        <GuestbookForm />
      </AddDialog>
      <GuestbookList messages={messages ?? []} />
    </main>
  );
}

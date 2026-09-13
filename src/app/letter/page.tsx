import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LoveLetterSlider } from "@/components/LoveLetterSlider";
import { logPageVisit } from "@/lib/tracking";

export default async function LetterPage() {
  await logPageVisit("Letter");
  const supabase = await createClient();
  const { data: proposal } = await supabase
    .from("proposal_status")
    .select("accepted")
    .eq("id", true)
    .maybeSingle();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase
    .from("proposal_events")
    .insert({ event_type: "view", user_email: user?.email });

  return (
    <main className="relative flex min-h-full flex-1 flex-col items-center bg-gradient-to-b from-rose-50 via-white to-rose-50 px-6 py-10 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Link
        href="/"
        className="absolute top-6 right-6 text-xs font-medium text-neutral-400 transition hover:text-rose-500 dark:text-neutral-500"
      >
        Close
      </Link>
      <div className="m-auto w-full max-w-sm">
        <LoveLetterSlider initiallyAccepted={proposal?.accepted ?? false} />
      </div>
    </main>
  );
}

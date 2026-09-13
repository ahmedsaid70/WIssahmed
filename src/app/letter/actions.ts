"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function acceptProposal(message?: string) {
        console.log("she said yes")

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("proposal_events")
    .insert({ event_type: "yes", message, user_email: user.email });

  const { error } = await supabase
    .from("proposal_status")
    .update({ accepted: true, accepted_at: new Date().toISOString() })
    .eq("id", true);

  if (error) throw new Error(error.message);

  revalidatePath("/letter");
  revalidatePath("/insights");
}

export async function logNoClick(message?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("proposal_events")
    .insert({ event_type: "no", message, user_email: user.email });
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addGuestbookMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const message = String(formData.get("message") ?? "").trim();
  if (!message) return;

  const { error } = await supabase.from("guestbook_messages").insert({
    author: user.email,
    message,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/guestbook");
}

export async function deleteGuestbookMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id"));
  await supabase.from("guestbook_messages").delete().eq("id", id);
  revalidatePath("/guestbook");
}

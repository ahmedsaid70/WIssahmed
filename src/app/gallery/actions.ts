"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function revalidateMemoryPaths() {
  revalidatePath("/gallery");
  revalidatePath("/timeline");
  revalidatePath("/room");
}

export async function addMemory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("photo") as File | null;
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const favorite = formData.get("favorite") === "on";

  let url: string | null = null;
  let storagePath: string | null = null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    storagePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(storagePath, file, { contentType: file.type });

    if (uploadError) throw new Error(uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(storagePath);
    url = publicUrl;
  }

  const { error: insertError } = await supabase.from("photos").insert({
    url,
    storage_path: storagePath,
    title: title || null,
    date: date || undefined,
    favorite,
    uploaded_by: user.email,
  });

  if (insertError) throw new Error(insertError.message);

  revalidateMemoryPaths();
}

export async function deleteMemory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id"));
  const path = String(formData.get("path") ?? "");

  if (path) {
    await supabase.storage.from("photos").remove([path]);
  }
  await supabase.from("photos").delete().eq("id", id);

  revalidateMemoryPaths();
}

export async function toggleFavorite(id: string, favorite: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("photos").update({ favorite }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateMemoryPaths();
}

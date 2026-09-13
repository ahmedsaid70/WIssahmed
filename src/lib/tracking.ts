import { createClient } from "@/lib/supabase/server";

/** Best-effort page-visit log -- never let a tracking failure break the page. */
export async function logPageVisit(page: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("page_visits").insert({ message: page, user_email: user.email });
  } catch {
    // ignore -- tracking is not critical
  }
}

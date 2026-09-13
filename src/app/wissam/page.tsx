import { createClient } from "@/lib/supabase/server";
import { WissamPage } from "@/components/WissamPage";
import { logPageVisit } from "@/lib/tracking";

export default async function Wissam() {
  await logPageVisit("Wissam");
  const supabase = await createClient();
  const { data: photo } = await supabase
    .from("photos")
    .select("url, title")
    .not("url", "is", null)
    .order("favorite", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return <WissamPage heroPhoto={photo} />;
}

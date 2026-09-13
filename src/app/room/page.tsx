import { createClient } from "@/lib/supabase/server";
import { RoomScene } from "@/components/RoomScene";
import { logPageVisit } from "@/lib/tracking";

export default async function RoomPage() {
  await logPageVisit("Room");
  const supabase = await createClient();

  const [{ data: photos }, { data: messages }, { data: timelineEntries }] = await Promise.all([
    supabase
      .from("photos")
      .select("id, url, caption")
      .not("url", "is", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("guestbook_messages")
      .select("id, author, message")
      .order("created_at", { ascending: false }),
    supabase
      .from("photos")
      .select("id, date, title, description:caption, photo_url:url")
      .order("date", { ascending: true }),
  ]);

  return (
    <RoomScene
      photos={photos ?? []}
      messages={messages ?? []}
      timelineEntries={timelineEntries ?? []}
    />
  );
}

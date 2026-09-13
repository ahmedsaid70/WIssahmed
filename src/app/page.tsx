import { Countdown } from "@/components/Countdown";
import { WissamiIntro } from "@/components/WissamiIntro";
import { SiteTitle } from "@/components/SiteTitle";
import { relationshipStartDate, herBirthday } from "@/lib/config";
import { logPageVisit } from "@/lib/tracking";

export default async function Home() {
  await logPageVisit("Home");

  return (
    <main className="flex min-h-full flex-1 flex-col items-center bg-gradient-to-b from-rose-50 to-white px-4 py-5 text-center dark:from-neutral-950 dark:to-neutral-950">
      <SiteTitle />
      <p className="mt-1.5 max-w-sm text-neutral-500 dark:text-neutral-400">
        Every photo, memory, and note, in one place.
      </p>

      <div className="mt-5 flex w-full max-w-sm flex-col gap-3">
        <Countdown startDate={relationshipStartDate} herBirthday={herBirthday} />
        <WissamiIntro />
      </div>
    </main>
  );
}

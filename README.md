# Us

A private website for the two of you: a photo gallery, a memory timeline, an
anniversary countdown, and a notes/guestbook — both of you can log in and add
things.

Built with Next.js, Tailwind CSS, and Framer Motion. Data, file storage, and
login are handled by [Supabase](https://supabase.com) (free tier).

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), sign up, and create a new project (free tier).
2. In the dashboard, go to **SQL Editor -> New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   database tables and access rules.
3. Go to **Storage -> New bucket**, name it exactly `photos`, and turn
   **Public bucket** ON. (The schema.sql file above also adds the storage
   access policies — run it after creating the bucket.)
4. Go to **Authentication -> Users -> Add user**, and create two accounts:
   one for you, one for your girlfriend (email + password each). These are
   the only two accounts that will ever be able to log in — there's no public
   sign-up.
5. Go to **Project Settings -> API** and copy the **Project URL** and the
   **anon public** key.

## 2. Configure the app locally

```bash
cp .env.local.example .env.local
```

Paste in the Project URL and anon key from step 1.5, and set
`NEXT_PUBLIC_RELATIONSHIP_START_DATE` to the date you got together
(`YYYY-MM-DD`) — it drives the countdown on the home page.

## 3. Run it locally

This project needs Node 18.18+ (a newer LTS is recommended). If `node -v`
shows something older, run:

```bash
nvm install --lts
nvm use --lts
```

Then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with either
of the two accounts you created.

## 4. Deploy for free

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign up, and import the repo.
3. In the Vercel project's **Settings -> Environment Variables**, add the
   same three variables from `.env.local`.
4. Deploy. Vercel gives you a free `.vercel.app` URL.

That's it — $0/month for a personal site at this scale (Vercel Hobby +
Supabase Free tier).

## Notes

- Photos are stored in a **public** Supabase Storage bucket, so anyone with
  the exact photo URL could view it without logging in — the URLs aren't
  linked from anywhere public, but they aren't secret either. This keeps
  setup simple; if you want stricter privacy later, switch to signed URLs.
- Both accounts have equal permissions: either of you can add or delete
  photos, timeline entries, and notes.

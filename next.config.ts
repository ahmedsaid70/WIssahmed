import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [new URL(`${supabaseUrl}/storage/v1/object/public/**`)]
      : [],
    // This machine/network resolves the Supabase host through a NAT64
    // gateway, which Next's SSRF check otherwise flags as a "local" IP and
    // blocks. The host itself is already locked down via remotePatterns
    // above, so allowing this is safe here.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;

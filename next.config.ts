import { spawnSync } from "child_process";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import { z } from "zod";

(() => {
  const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    POSTGRES_DATABASE: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_PRISMA_URL: z.url(),
    POSTGRES_URL: z.url(),
    POSTGRES_URL_NON_POOLING: z.url(),
    POSTGRES_USER: z.string().min(1),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_JWT_SECRET: z.string().min(1),
    SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    SUPABASE_SECRET_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SUPABASE_URL: z.url(),
  });

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(z.flattenError(parsed.error));
    process.exit(1);
  }
})();

const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout.trim() ?? crypto.randomUUID();

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  reloadOnOnline: false,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [
    { url: "/", revision },
    { url: "/offline", revision },
  ],
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);


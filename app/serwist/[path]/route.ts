import { createSerwistRoute } from "@serwist/turbopack";
import { spawnSync } from "node:child_process";
import { type NextRequest, NextResponse } from "next/server";

const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout ?? crypto.randomUUID();

const serwistRoute = createSerwistRoute({
  additionalPrecacheEntries: [
    { url: "/", revision },
    { url: "/offline", revision },
  ],
  swSrc: "app/sw.ts",
  useNativeEsbuild: true,
});

export const { dynamic, dynamicParams, revalidate, generateStaticParams } = serwistRoute;

export async function GET(request: NextRequest, context: { params: Promise<{ path: string }> }) {
  const response = await serwistRoute.GET(request, context);
  const newResponse = new NextResponse(response.body, response);
  newResponse.headers.set("Content-Type", "application/javascript; charset=utf-8");
  newResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  newResponse.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'");
  return newResponse;
}


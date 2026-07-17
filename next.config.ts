import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      { protocol: "https", hostname: "i.ibb.co.com" },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
});

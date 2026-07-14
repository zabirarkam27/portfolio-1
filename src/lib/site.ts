import type { Metadata } from "next";

const fallbackUrl = "http://localhost:3000";

export function getSiteUrl() {
  const explicitUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const rawUrl = explicitUrl || vercelProductionUrl || vercelUrl || fallbackUrl;

  return rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function baseMetadata({
  title,
  description,
  image,
  path = "/",
}: {
  title: string;
  description: string;
  image: string;
  path?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: imageUrl, width: 1200, height: 800 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

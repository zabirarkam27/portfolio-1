import type { Metadata } from "next";

import { HomePage } from "./home-page";
import { getHomeContent } from "@/lib/content";
import { absoluteUrl, baseMetadata } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getHomeContent();

  return baseMetadata({
    title: `${profile.name} - ${profile.designation}`,
    description: profile.tagline,
    image: profile.photoUrl,
  });
}

export default async function Home() {
  const content = await getHomeContent();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.profile.name,
    jobTitle: content.profile.designation,
    description: content.profile.tagline,
    image: absoluteUrl(content.profile.photoUrl),
    url: absoluteUrl("/"),
    email: content.contactInfo.email,
    sameAs: content.socialLinks.map((link) => link.url),
    knowsAbout: content.skillRows
      .filter((skill) => skill.category !== "Tag")
      .slice(0, 20)
      .map((skill) => skill.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HomePage content={content} />
    </>
  );
}

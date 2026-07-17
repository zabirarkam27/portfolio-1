"use client";

import { About } from "@/components/portfolio/About";
import { Achievements } from "@/components/portfolio/Achievements";
import { Contact } from "@/components/portfolio/Contact";
import { Education } from "@/components/portfolio/Education";
import { Experience } from "@/components/portfolio/Experience";
import { Footer } from "@/components/portfolio/Footer";
import { Hero } from "@/components/portfolio/Hero";
import { Navbar } from "@/components/portfolio/Navbar";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import type { HomeContent } from "@/lib/content-types";

export function HomePage({ content }: { content: HomeContent }) {
  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <Navbar />
      <main>
        <Hero
          profile={content.profile}
          socialLinks={content.socialLinks}
          heroStats={content.heroStats}
          skills={content.skillRows}
        />
        <About aboutMe={content.aboutMe} />
        <Skills groups={content.skillGroups} tags={content.skillTags} />
        <Projects projects={content.projects} />
        <Achievements achievements={content.achievements} />
        <Education items={content.education} />
        <Experience roles={content.experience} />
        <Contact contactInfo={content.contactInfo} />
      </main>
      <Footer profile={content.profile} socialLinks={content.socialLinks} />
    </div>
  );
}

"use client";

import { About } from "@/components/portfolio/About";
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
        <Hero profile={content.profile} socialLinks={content.socialLinks} />
        <About aboutMe={content.aboutMe} />
        <Skills groups={content.skillGroups} tags={content.skillTags} />
        <Education items={content.education} />
        <Experience roles={content.experience} />
        <Projects projects={content.projects} />
        <Contact contactInfo={content.contactInfo} />
      </main>
      <Footer profile={content.profile} socialLinks={content.socialLinks} />
    </div>
  );
}

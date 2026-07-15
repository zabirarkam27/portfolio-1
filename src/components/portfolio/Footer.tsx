import { Github, Linkedin, Twitter, Facebook } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SocialLink } from "@/generated/prisma/client";
import type { ProfileContent } from "@/lib/content-types";

const socialIcons: Record<string, LucideIcon> = {
  Facebook,
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter,
};

export function Footer({
  profile,
  socialLinks,
}: {
  profile: ProfileContent;
  socialLinks: SocialLink[];
}) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-display text-sm font-bold">
              A
            </span>
            <div>
              <div className="font-display text-sm font-semibold">{profile.name}</div>
              <div className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
                {profile.footerTagline}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.platform] ?? Github;

              return (
                <a
                  key={social.platform}
                  href={social.url}
                  aria-label={social.platform}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 font-mono-tight text-[11px] text-muted-foreground sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
          <span>Handcrafted in Dhaka · v2.6</span>
        </div>
      </div>
    </footer>
  );
}

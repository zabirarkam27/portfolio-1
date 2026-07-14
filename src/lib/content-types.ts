import type {
  AboutMe,
  ContactInfo,
  Education,
  Experience,
  Profile,
  Project,
  Skill,
  SocialLink,
} from "@/generated/prisma/client";

export type ProfileStat = {
  key: string;
  value: string;
};

export type AboutFact = {
  key: string;
  value: string;
};

export type ProfileContent = Omit<Profile, "stats"> & {
  stats: ProfileStat[];
};

export type AboutContent = Omit<AboutMe, "facts"> & {
  facts: AboutFact[];
  paragraphs: string[];
};

export type SkillGroup = {
  label: string;
  tag: string;
  items: Array<{
    name: string;
    lvl: number;
  }>;
};

export type HomeContent = {
  profile: ProfileContent;
  aboutMe: AboutContent;
  socialLinks: SocialLink[];
  skillRows: Skill[];
  skillGroups: SkillGroup[];
  skillTags: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  contactInfo: ContactInfo;
};

export type ProjectContent = Project;

import "server-only";

import { prisma } from "@/lib/prisma";

export const imageContentTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const resumeContentTypes = ["application/pdf"] as const;

export type UploadKind = "profile-photo" | "resume" | "project-image";

export type UploadPayload = {
  kind: UploadKind;
  projectId?: string;
  uploadSecret?: string;
};

export function parseUploadPayload(value: string | null | undefined): UploadPayload {
  if (!value) {
    throw new Error("Missing upload payload");
  }

  const payload = JSON.parse(value) as Partial<UploadPayload>;

  if (
    payload.kind !== "profile-photo" &&
    payload.kind !== "resume" &&
    payload.kind !== "project-image"
  ) {
    throw new Error("Unsupported upload kind");
  }

  if (payload.kind === "project-image" && !payload.projectId) {
    throw new Error("Project image uploads require projectId");
  }

  return payload as UploadPayload;
}

export function assertUploadAuthorized(payload: UploadPayload, request?: Request) {
  const expectedSecret = process.env.UPLOAD_SECRET;

  if (!expectedSecret) {
    return;
  }

  const headerSecret = request?.headers.get("x-upload-secret");
  const providedSecret = payload.uploadSecret ?? headerSecret;

  if (providedSecret !== expectedSecret) {
    throw new Error("Unauthorized upload");
  }
}

export function allowedContentTypes(kind: UploadKind): string[] {
  return kind === "resume" ? [...resumeContentTypes] : [...imageContentTypes];
}

export function uploadPath(kind: UploadKind, filename: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");

  if (kind === "profile-photo") {
    return `profile/${safeName}`;
  }

  if (kind === "resume") {
    return `resume/${safeName}`;
  }

  return `projects/${safeName}`;
}

export async function updateAssetUrl(payload: UploadPayload, url: string) {
  if (payload.kind === "profile-photo") {
    return prisma.profile.updateMany({
      data: { photoUrl: url },
    });
  }

  if (payload.kind === "resume") {
    return prisma.profile.updateMany({
      data: { resumeUrl: url },
    });
  }

  return prisma.project.update({
    where: { id: payload.projectId },
    data: { imageUrl: url },
  });
}

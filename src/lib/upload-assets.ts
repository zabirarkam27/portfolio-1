import "server-only";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { type UploadKind } from "@/lib/upload-validation";

export { allowedContentTypes, validateUploadFile, type UploadKind } from "@/lib/upload-validation";

export type UploadPayload = {
  kind: UploadKind;
  projectId?: string;
  uploadSecret?: string;
};

const uploadPayloadSchema = z
  .object({
    kind: z.enum(["profile-photo", "resume", "project-image"]),
    projectId: z.string().optional(),
    uploadSecret: z.string().optional(),
  })
  .superRefine((payload, ctx) => {
    if (payload.kind === "project-image" && !payload.projectId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project image uploads require projectId",
        path: ["projectId"],
      });
    }
  });

export function parseUploadPayload(value: string | null | undefined): UploadPayload {
  if (!value) {
    throw new Error("Missing upload payload");
  }

  const result = uploadPayloadSchema.safeParse(JSON.parse(value));

  if (!result.success) {
    throw new Error("Invalid upload payload");
  }

  return result.data;
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

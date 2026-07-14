import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import {
  assertUploadAuthorized,
  parseUploadPayload,
  updateAssetUrl,
  uploadPath,
  validateUploadFile,
} from "@/lib/upload-assets";
import { requireAdminForApi } from "@/lib/admin-auth";
import { revalidatePortfolioPaths } from "@/lib/revalidate";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const payload = parseUploadPayload(formData.get("payload")?.toString());
    const admin = await requireAdminForApi();

    if (!admin) {
      assertUploadAuthorized(payload, request);
    }

    if (!(file instanceof File)) {
      throw new Error("Missing file");
    }

    validateUploadFile(payload.kind, file);

    const blob = await put(uploadPath(payload.kind, file.name), file, {
      access: "public",
      addRandomSuffix: true,
    });

    await updateAssetUrl(payload, blob.url);
    revalidatePortfolioPaths();

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

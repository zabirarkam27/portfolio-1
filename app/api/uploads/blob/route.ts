import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import {
  allowedContentTypes,
  assertUploadAuthorized,
  parseUploadPayload,
  updateAssetUrl,
} from "@/lib/upload-assets";
import { requireAdminForApi } from "@/lib/admin-auth";
import { revalidatePortfolioPaths } from "@/lib/revalidate";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const payload = parseUploadPayload(clientPayload);
        const admin = await requireAdminForApi();
        if (!admin) {
          assertUploadAuthorized(payload, request);
        }

        return {
          allowedContentTypes: allowedContentTypes(payload.kind),
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            kind: payload.kind,
            projectId: payload.projectId,
            achievementId: payload.achievementId,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = parseUploadPayload(tokenPayload);
        await updateAssetUrl(payload, blob.url);
        revalidatePortfolioPaths();
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  deleteResourceById,
  getResourceById,
  isDashboardResource,
  isUniqueError,
  updateResourceById,
  validateUpdate,
} from "@/lib/dashboard-crud";
import { requireAdminForApi } from "@/lib/admin-auth";

type RouteContext = {
  params: Promise<{ resource: string; id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resource, id } = await context.params;

  if (!isDashboardResource(resource)) {
    return NextResponse.json({ error: "Unknown dashboard resource" }, { status: 404 });
  }

  try {
    const data = await getResourceById(resource, id);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Dashboard record not found" }, { status: 404 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resource, id } = await context.params;

  if (!isDashboardResource(resource)) {
    return NextResponse.json({ error: "Unknown dashboard resource" }, { status: 404 });
  }

  const result = validateUpdate(resource, await request.json());

  if (!result.success) {
    return validationError(result.error);
  }

  try {
    const data = await updateResourceById(resource, id, result.data);
    return NextResponse.json({ data });
  } catch (error) {
    return handleMutationError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resource, id } = await context.params;

  if (!isDashboardResource(resource)) {
    return NextResponse.json({ error: "Unknown dashboard resource" }, { status: 404 });
  }

  try {
    const data = await deleteResourceById(resource, id);
    return NextResponse.json({ data });
  } catch (error) {
    return handleMutationError(error);
  }
}

function validationError(error: ZodError) {
  return NextResponse.json(
    { error: "Invalid request body", details: error.flatten() },
    { status: 400 },
  );
}

function handleMutationError(error: unknown) {
  if (isUniqueError(error)) {
    return NextResponse.json(
      { error: "A record with this unique value already exists" },
      { status: 409 },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ error: "Dashboard mutation failed" }, { status: 500 });
}

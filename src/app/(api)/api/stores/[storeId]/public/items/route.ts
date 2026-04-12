import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { listStoreItemsForPublic } from "@/server/api/store/list-store-items-for-public";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message.trim() : "Unexpected error.";
}

type RouteContext = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { storeId } = await context.params;
    const result = await listStoreItemsForPublic(storeId);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      );
    }
    return NextResponse.json({ items: result.items });
  } catch (err: unknown) {
    logError(err, { context: "GET /api/stores/[storeId]/public/items" });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

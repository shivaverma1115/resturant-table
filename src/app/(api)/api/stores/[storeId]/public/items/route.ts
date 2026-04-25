import { NextResponse } from "next/server";

import { logError } from "@/lib/utils/logError";
import { listStoreItemsForPublic, ListStoreItemsForPublicResult } from "@/server/api/store/list-store-items-for-public";
import { errorMessage } from "@/lib/helpers";

type RouteContext = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { storeId } = await context.params;
    const result: ListStoreItemsForPublicResult = await listStoreItemsForPublic(storeId);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: result.status });

    return NextResponse.json({ items: result.items });
  } catch (err: unknown) {
    logError(err, {
      context: "Stores [storeId]/public/items route API",
      meta: { url: "/api/stores/[storeId]/public/items", method: "GET" },
    });
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

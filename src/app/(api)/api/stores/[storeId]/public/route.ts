import { errorMessage } from "@/lib/helpers";
import { logError } from "@/lib/utils/logError";
import { requireSessionUid } from "@/server/api/auth/require-session";
import { getStoreForOwner, GetStoreForOwnerResult } from "@/server/api/store/get-store-for-owner";
import { NextResponse } from "next/server";

type RouteContext = Readonly<{
    params: Promise<{ storeId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
    try {
        const session = await requireSessionUid();
        if (!session.ok) return NextResponse.json({ error: session.message }, { status: session.status });

        const { storeId } = await context.params;
        const result: GetStoreForOwnerResult = await getStoreForOwner(session.uid, storeId);

        return NextResponse.json({ result })
    }
    catch (err: unknown) {
        logError(err, {
            context: "GET Stores [storeId]/public route API",
            meta: { url: "/api/stores/[storeId]/public", method: "GET" },
        });
        return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
    }
}
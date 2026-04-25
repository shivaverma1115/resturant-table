import { NextResponse } from "next/server";
import { getFirebaseWebClientConfig } from "@/config/config";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { logError } from "@/lib/utils/logError";
import { errorMessage } from "@/lib/helpers";

export type HealthStatusResponse = {
    ok: true;
    firebaseClientConfigured: boolean;
    firebaseAdminConfigured: boolean;
};


export function GET() {
    try {
        return NextResponse.json(getHealthStatus());
    } catch (error) {
        logError(error,
            {
                context: "Health API",
                meta: { url: "/api/health", method: "GET" },
            }
        );
        return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
    }
}


function getHealthStatus(): HealthStatusResponse {
    return {
        ok: true,
        firebaseClientConfigured: getFirebaseWebClientConfig() !== null,
        firebaseAdminConfigured: isFirebaseAdminConfigured(),
    };
}

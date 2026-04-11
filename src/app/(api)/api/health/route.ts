// import { ENV_SERVER } from "@/lib/config";
// import { NextResponse } from "next/server";

// export type HealthStatusResponse = {
//   ok: true;
//   firebaseClientConfigured: boolean;
//   firebaseAdminConfigured: boolean;
// };


export function GET() {
//   return NextResponse.json(getHealthStatus());
}


// function getHealthStatus(): HealthStatusResponse {
//   const server = getServerEnv();
//   const firebaseAdminConfigured = Boolean(
//     server[ENV_SERVER.FIREBASE_ADMIN_CLIENT_EMAIL] &&
//       server[ENV_SERVER.FIREBASE_ADMIN_PRIVATE_KEY],
//   );

//   return {
//     ok: true,
//     firebaseClientConfigured: isFirebaseWebConfigured(),
//     firebaseAdminConfigured,
//   };
// }

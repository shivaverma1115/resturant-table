// import { readFile } from "node:fs/promises";
// import path from "node:path";

// import { NextResponse } from "next/server";

// import { logError } from "@/lib/utils/logError";
// import { requireSessionUid } from "@/server/api/auth/require-session";
// import { getStoreForOwner } from "@/server/api/store/get-store-for-owner";
// import { getAbsoluteCoverFilePath } from "@/server/media/cover-local-path";

// function mimeFromFilePath(filePath: string): string {
//   const ext = path.extname(filePath).toLowerCase();
//   if (ext === ".png") return "image/png";
//   if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
//   if (ext === ".webp") return "image/webp";
//   if (ext === ".gif") return "image/gif";
//   if (ext === ".mp4") return "video/mp4";
//   if (ext === ".webm") return "video/webm";
//   return "application/octet-stream";
// }

type RouteContext = Readonly<{
  params: Promise<{ storeId: string }>;
}>;

export async function GET(_request: Request, context: RouteContext) {
//   try {
//     const session = await requireSessionUid();
//     if (!session.ok) {
//       return NextResponse.json(
//         { error: session.message },
//         { status: session.status },
//       );
//     }

//     const { storeId } = await context.params;
//     const result = await getStoreForOwner(session.uid, storeId);
//     if (!result.ok) {
//       return NextResponse.json(
//         { error: result.message },
//         { status: result.status },
//       );
//     }

//     const store = result.store;
//     if (store.coverMediaUrl?.trim()) {
//       return NextResponse.json(
//         { error: "This store uses a cloud cover URL." },
//         { status: 404 },
//       );
//     }

//     const abs = getAbsoluteCoverFilePath(store.coverMediaLocalPath);
//     if (!abs) {
//       return NextResponse.json(
//         {
//           error:
//             "No on-disk cover for this store. Set NEXT_PUBLIC_LOCAL_COVER_MEDIA_ROOT in .env.local to your images folder, restart dev, then save store settings with a cover file from that folder.",
//         },
//         { status: 404 },
//       );
//     }

//     const data = await readFile(abs);
//     return new NextResponse(data, {
//       headers: {
//         "Content-Type": mimeFromFilePath(abs),
//         "Cache-Control": "private, max-age=60",
//       },
//     });
//   } catch (err: unknown) {
//     logError(err, { context: "GET /api/stores/[storeId]/local-cover" });
//     const code = (err as NodeJS.ErrnoException)?.code;
//     if (code === "ENOENT") {
//       return NextResponse.json(
//         { error: "Cover file was not found at the saved path." },
//         { status: 404 },
//       );
//     }
//     return NextResponse.json({ error: "Could not read cover file." }, { status: 500 });
//   }
}

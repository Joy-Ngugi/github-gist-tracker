// import { NextResponse } from "next/server";
// import { createReadStream } from "fs";
// import { join } from "path";
// import type { NextRequest } from "next/server";

// export async function GET(
//   req: NextRequest,
//   context: { params: { filename: string } }
// ) {
//   // Await params properly
//   const { filename } = await context.params;

//   if (!filename) {
//     return NextResponse.json({ error: "Filename is required" }, { status: 400 });
//   }

//   const filePath = join(process.cwd(), "uploads", filename);
  

//   try {
//     const stream = createReadStream(filePath);
//     return new NextResponse(new ReadableStream({
//       start(controller) {
//         stream.on("data", (chunk) => controller.enqueue(chunk));
//         stream.on("end", () => controller.close());
//         stream.on("error", (err) => controller.error(err));
//       },
//     }), {
//       headers: { "Content-Type": "image/png" },
//     });
//   } catch (error) {
//     console.error("File read error:", error);
//     return NextResponse.json({ error: "Image not found" }, { status: 404 });
//   }
// }

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import type { NextRequest } from "next/server";
import mime from "mime-types";

export async function GET(
  req: NextRequest,
  { params }: { params?: { filename?: string } } // ✅ Optional params for safety
) {
  if (!params?.filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  const filePath = join(process.cwd(), "public/uploads", params.filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: { "Content-Type": mimeType },
    });
  } catch (error) {
    console.error("File read error:", error);
    return NextResponse.json({ error: "File not found or cannot be read" }, { status: 404 });
  }
}

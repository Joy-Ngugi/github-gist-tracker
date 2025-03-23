import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { connectDB } from "@/utils/db";
import User from "@/models/user";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  const formData = await req.formData();
  const id = formData.get("id") as string;
  const file = formData.get("file") as File;

  if (!id || !file) {
    return NextResponse.json({ error: "Missing user ID or file" }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${id}.png`;
  const filePath = join(process.cwd(), "public/uploads", fileName); // Save to public/uploads

  await writeFile(filePath, fileBuffer);

  const avatarUrl = `/uploads/${fileName}`; // Relative path

  
  const updatedUser = await User.findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true });

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Avatar updated successfully", url: avatarUrl });
}







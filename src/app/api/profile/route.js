import { connectDB } from "@/utils/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

// GET - Fetch Profile
export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

// POST - Create Profile
export async function POST(req) {
  await connectDB();
  const { name, email, bio, avatar } = await req.json();
  const newUser = new User({ name, email, bio, avatar });
  await newUser.save();
  return NextResponse.json(newUser);
}

// PUT - Update Profile
export async function PUT(req) {
  await connectDB();
  const { id, name, bio, avatar } = await req.json();
  const updatedUser = await User.findByIdAndUpdate(id, { name, bio, avatar }, { new: true });

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updatedUser);
}

// DELETE - Delete Profile
export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: "User deleted" });
}




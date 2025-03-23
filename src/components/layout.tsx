"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🌍 Navbar */}
      <nav className="w-full bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
        <Link href="/" className="text-xl font-bold">📂 Gist Tracker</Link>
        <div className="flex items-center space-x-4">
        <Link href="/" className="hover:underline">Home</Link>
          <Link href="/gists" className="hover:underline">Gists</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
          {session ? (
            <button 
              onClick={() => signOut()} 
              className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => signIn("github")} 
              className="px-4 py-2 bg-black rounded-lg text-white hover:bg-gray-800"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* 📄 Main Content */}
      <main className="flex-1 container mx-auto p-6">{children}</main>
    </div>
  );
}

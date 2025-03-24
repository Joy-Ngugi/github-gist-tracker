"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";


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


      <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold">Github Gist Tracker</h2>
          <p className="text-sm text-gray-400 mt-1">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
    </div>
  );
}

"use client";

// import Link from "next/link";
import { useSession} from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";


// Define the structure of a Gist
interface Gist {
  id: string;
  description: string;
  html_url: string;
  files: Record<string, { filename: string; type: string; raw_url: string }>;
}

export default function Home() {
  const { data: session } = useSession();
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // For filtering gists

  // Fetch public gists
  useEffect(() => {
    axios
      .get<Gist[]>("https://api.github.com/gists/public?per_page=5")
      .then((res) => setGists(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter gists by search input
  const filteredGists = gists.filter((gist) =>
    gist.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Gist Tracker</h1>
        <p className="text-lg text-gray-600 mt-2">Manage your GitHub gists and explore public gists easily.</p>
      </div>

      {/* User Info */}
      {session && (
        <div className="bg-white p-4 mx-6 rounded-lg shadow-md flex items-center space-x-4">
          <img src={session.user?.image || "/default-avatar.png"} alt="User Avatar" className="w-14 h-14 rounded-full border"/>
          <div>
            <h2 className="text-lg font-semibold">{session.user?.name}</h2>
            <p className="text-gray-500">{session.user?.email}</p>
          </div>
        </div>
      )}

      

      {/* Search Bar */}
      <div className="flex justify-center mt-6">
        <input 
          type="text" 
          placeholder="Search Gists..." 
          className="p-2 border border-gray-300 rounded-lg w-2/3 focus:ring focus:ring-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Public Gists Section */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔥 Recent Public Gists</h2>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGists.length > 0 ? (
              filteredGists.map((gist) => (
                <div key={gist.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold text-gray-800">{gist.description || "No Description"}</h3>
                  <p className="text-sm text-gray-500">Files: {Object.keys(gist.files).length}</p>
                  <a href={gist.html_url} target="_blank" className="text-blue-500 hover:underline">
                    View Gist
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No gists available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



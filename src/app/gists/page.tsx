// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";

// // const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// interface Gist {
//   id: string;
//   description: string;
//   html_url: string;
// }

// export default function GistsPage() {
//   const [gists, setGists] = useState<Gist[]>([]);
//   const [search, setSearch] = useState("");
//   // const [newGist, setNewGist] = useState({ description: "", filename: "", content: "" });

//   // ✅ Fetch all public gists
//   useEffect(() => {
//     axios
//       .get<Gist[]>("https://api.github.com/gists/public")
//       .then((res) => setGists(res.data))
//       .catch((err) => console.error("Error fetching gists:", err));
//   }, []);

//   // ✅ Filtered gists based on search
//   const filteredGists = gists.filter((gist) =>
//     gist.description?.toLowerCase().includes(search.toLowerCase())
//   );

  

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//   <h1 className="text-3xl font-bold text-center mb-4">Public Gists</h1>

//   {/* 🔍 Search Input */}
//   <div className="flex justify-center mb-6">
//     <input
//       type="text"
//       placeholder="Search Gists..."
//       className="p-2 border border-gray-300 rounded-lg w-full max-w-lg focus:ring focus:ring-blue-300"
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//     />
//   </div>

//   {/* 📜 Gist List */}
//   <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 sm:px-8 md:px-20">
//     {filteredGists.length > 0 ? (
//       filteredGists.map((gist) => (
//         <div 
//           key={gist.id} 
//           className="p-4 rounded-lg bg-white shadow-md shadow-green-300 transform motion-safe:hover:scale-105 transition-all duration-300 min-h-[120px] flex flex-col justify-between"
//         >
//           <h2 className="text-lg font-semibold break-words">{gist.description || "No Description"}</h2>
//           <a 
//             href={gist.html_url} 
//             target="_blank" 
//             className="text-blue-500 hover:underline self-end mt-auto"
//           >
//             View Gist
//           </a>
//         </div>
//       ))
//     ) : (
//       <p className="text-center text-gray-500 col-span-full">No gists found.</p>
//     )}
//   </div>
// </div>

//   );
// }


"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN; // Ensure this is set in your environment

interface Gist {
  id: string;
  description: string;
  html_url: string;
}

export default function GistsPage() {
  const [gists, setGists] = useState<Gist[]>([]);
  const [search, setSearch] = useState("");
  const [starredGists, setStarredGists] = useState<string[]>([]); // Stores starred gist IDs

  // ✅ Fetch all public gists
  useEffect(() => {
    axios
      .get<Gist[]>("https://api.github.com/gists/public")
      .then((res) => setGists(res.data))
      .catch((err) => console.error("Error fetching gists:", err));

    fetchStarredGists(); // Fetch starred gists
  }, []);

  // ✅ Fetch user's starred gists
  const fetchStarredGists = async () => {
    try {
      const res = await axios.get<Gist[]>("https://api.github.com/gists/starred", {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
      });
      setStarredGists(res.data.map((gist) => gist.id));
    } catch (error) {
      console.error("Error fetching starred gists:", error);
    }
  };

  // ✅ Toggle star/unstar
  const toggleStarGist = async (gistId: string) => {
    try {
      if (starredGists.includes(gistId)) {
        await axios.delete(`https://api.github.com/gists/${gistId}/star`, {
          headers: { Authorization: `token ${GITHUB_TOKEN}` },
        });
        setStarredGists(starredGists.filter((id) => id !== gistId)); // Remove from starred
      } else {
        await axios.put(
          `https://api.github.com/gists/${gistId}/star`,
          {},
          { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        setStarredGists([...starredGists, gistId]); // Add to starred
      }
    } catch (error) {
      console.error("Error starring/un-starring gist:", error);
    }
  };

  // ✅ Filter gists based on search
  const filteredGists = gists.filter((gist) =>
    gist.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Public Gists</h1>

      {/* 🔍 Search Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search Gists..."
          className="p-2 border border-gray-300 rounded-lg w-full max-w-lg focus:ring focus:ring-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📜 Gist List */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 sm:px-8 md:px-20">
        {filteredGists.length > 0 ? (
          filteredGists.map((gist) => (
            <div
              key={gist.id}
              className="p-4 rounded-lg bg-white shadow-md shadow-green-300 transform motion-safe:hover:scale-105 transition-all duration-300 min-h-[120px] flex flex-col justify-between"
            >
              <h2 className="text-lg font-semibold break-words">{gist.description || "No Description"}</h2>
              <div className="flex justify-between mt-2">
                <a
                  href={gist.html_url}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  View Gist
                </a>
                <button
                  onClick={() => toggleStarGist(gist.id)}
                  className={`px-3 py-1 rounded text-white ${
                    starredGists.includes(gist.id) ? "bg-yellow-500" : "bg-gray-400"
                  } hover:opacity-80`}
                >
                  {starredGists.includes(gist.id) ? "⭐ Unstar" : "☆ Star"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No gists found.</p>
        )}
      </div>
      
    </div>
  );
}

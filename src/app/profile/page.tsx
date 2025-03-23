"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import axios from "axios";
// import user from "@/models/user";
import LocationMap from "@/components/locationMap";

const ProfileSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  avatar: z.string().optional(), // Avatar URL
});

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// Define the Gist type
interface Gist {
  id: string;
  description: string;
  html_url: string;
}

type ProfileData = z.infer<typeof ProfileSchema>;

type User = {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
};


export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gists, setGists] = useState<Gist[]>([]);
  const [search, setSearch] = useState("");
  const [starredGists, setStarredGists] = useState<Gist[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newGist, setNewGist] = useState({
    description: "",
    filename: "",
    content: "",
  });

  useEffect(() => {
    axios
      .get<Gist[]>("https://api.github.com/users/Joy-Ngugi/gists", {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
      })
      .then((res) => setGists(res.data))
      .catch((error) => console.error("Error fetching gists:", error));
  }, []);

  // Filter gists based on search input
  const filteredGists = gists.filter((gist) =>
    gist.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Create a new Gist
  const createGist = async () => {
    if (!newGist.description || !newGist.filename || !newGist.content) {
      alert("All fields are required.");
      return;
    }

    try {
      const res = await axios.post(
        "https://api.github.com/gists",
        {
          description: newGist.description,
          public: true,
          files: { [newGist.filename]: { content: newGist.content } },
        },
        { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
      );

      setGists([res.data, ...gists]); // Update UI with new Gist
      setNewGist({ description: "", filename: "", content: "" }); // Reset form
    } catch (error) {
      console.error("Error creating Gist:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/profile');
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  const { reset, register, handleSubmit, setValue } = useForm<ProfileData>({
    resolver: zodResolver(ProfileSchema),
  });

  // Fetch profile data on component mount
  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch("/api/profile");
      const data = await response.json();
      setProfile(data[0]);
      setValue("name", data[0]?.name || "");
      setValue("bio", data[0]?.bio || "");
      setValue("avatar", data[0]?.avatar || "")
    }
    fetchProfile();
  }, [setValue]);


  // const {reset } = useForm<ProfileData>({
  //   resolver: zodResolver(ProfileSchema),
  // });

  async function updateProfile(data: ProfileData) {
    const response = await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ 
        id: profile?._id,  // Ensure we send the user ID
        name: data.name, 
        bio: data.bio, 
        // avatar: data.avatar 
        avatar: profile?.avatar 
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const updatedProfile = await response.json(); // Fetch updated profile
      setProfile(updatedProfile);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === updatedProfile._id ? updatedProfile : u))
      ); 
      alert("Profile updated successfully!");
      
      reset();
      
    } else {
      alert("Error updating profile!");
    }
  }



  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const userId = profile?._id || ""; // Ensure userId is available
    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", userId);
    formData.append("id", profile?._id || "default");

    try {
      const uploadResponse = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const result = await uploadResponse.json();
      console.log("Upload result:", result);
      if (result.url) {
        setValue("avatar", result.url);
        setProfile((prev) => prev ? { ...prev, avatar: result.url } : null);

      
      } else {
        console.error("Failed to upload avatar:", result);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  }

  async function deleteGist(gistId: string) {
    if (!confirm("Are you sure you want to delete this gist?")) return;
  
    try {
      await axios.delete(`https://api.github.com/gists/${gistId}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
      });
  
      // Remove deleted gist from the UI
      setGists((prevGists) => prevGists.filter((gist) => gist.id !== gistId));
  
      alert("Gist deleted successfully!");
    } catch (error) {
      console.error("Error deleting gist:", error);
      alert("Failed to delete gist.");
    }
  }
  

  useEffect(() => {
    const fetchStarredGists = async () => {
      try {
        const res = await axios.get<Gist[]>("https://api.github.com/gists/starred", {
          headers: { Authorization: `token ${GITHUB_TOKEN}` },
        });
        setStarredGists(res.data);
      } catch (error) {
        console.error("Error fetching starred gists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStarredGists();
  }, []);

return session ? (
  <div className="p-6 bg-gray-100">
    {loading ? (
      <div className="flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
      // <p>Loading user...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      <ul className="list-none mx-auto max-w-4xl">
        {users.map((user) => (
          <li key={user._id} className="mt-4">
            <h2 className="text-3xl font-bold text-center font-serif">Hello {user.name} 👋</h2>

            <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
              <img
                
                src={profile?.avatar ? profile.avatar : "/download.jpeg"}
                alt={user.name}
                width={120}
                height={120}
                className="w-32 h-32 rounded-full border"
              />

              <div className="text-lg font-serif">
                <p><strong className="text-green-500">Name:</strong> {user.name}</p>
                <p><strong className="text-green-500">Email:</strong> {user.email}</p>
                <p><strong className="text-green-500">Bio:</strong> {user.bio || "No bio available"}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}

    {isEditing ? (
      <form onSubmit={handleSubmit(updateProfile)} className="space-y-4 mx-auto max-w-lg">
        <div className="flex items-center space-x-4">
          <Image
            src="/download.jpeg"
            alt="Profile Picture"
            width={50}
            height={50}
            className="rounded-full"
          />
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          {profile?.avatar && (
        <button 
          type="button"
          onClick={() => {
            setValue("avatar", "/download.jpeg"); // Set default image
            setProfile((prev) => prev ? { ...prev, avatar: "/download.jpeg" } : null);
          }}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Remove
        </button>
      )}
        </div>

        <input {...register("name")} placeholder="Name" className="border p-2 w-full rounded" />
        <textarea {...register("bio")} placeholder="Bio" className="border p-2 w-full rounded" />

        <div className="flex flex-wrap gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
          {/* <button type="button" onClick={deleteProfile} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete Profile
          </button> */}
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    ) : (
      <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white font-bold px-4 py-2 rounded mx-auto mt-5 block hover:bg-blue-400 transition">
        Edit Profile ✏
      </button>
    )}

<LocationMap/>

<div className=" bg-gray-100 p-6 mt-30">
      

      {/* Starred Gists Section */}
      <h2 className="text-2xl font-semibold mb-4">⭐ Starred Gists</h2>
      
      {loading ? (
        <p className="text-gray-500">Loading starred gists...</p>
      ) : starredGists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[120px] ">
          {starredGists.map((gist) => (
            <div key={gist.id} className="p-4 rounded-lg bg-white shadow-md flex flex-col h-full">
              <h3 className="text-lg font-semibold break-words">
                {gist.description || "No Description"}
              </h3>
              <a
                href={gist.html_url}
                target="_blank"
                className="text-blue-500 hover:underline mt-auto block"
              >
                View Gist
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have not starred any gists yet.</p>
      )}
    </div>
    {/* GitHub Gists Section */}
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl border-b-2 border-green-300 mt-10 font-bold mb-4 text-center">Your GitHub Gists</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Gists..."
        className="border p-2 w-full max-w-md mx-auto block rounded mt-5"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Display Gists */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
        {filteredGists.length > 0 ? (
          filteredGists.map((gist) => (
            <div key={gist.id} className="bg-white p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold">{gist.description || "No Description"}</h2>
              <a href={gist.html_url} target="_blank" className="text-blue-500 hover:underline">
                View Gist
              </a>
              <button 
          onClick={() => deleteGist(gist.id)} 
          className="mt-2  text-red-600 px-3 py-1 rounded hover:underline transition ml-30"
        >
          Delete
        </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No gists found.</p>
        )}
      </div>

      {/* Create Gist Form */}
      <div className="bg-white p-6 mt-6 rounded shadow mx-auto max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Create a New Gist</h2>
        <input
          type="text"
          placeholder="Description"
          className="border p-2 w-full mb-2 rounded"
          value={newGist.description}
          onChange={(e) => setNewGist({ ...newGist, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filename"
          className="border p-2 w-full mb-2 rounded"
          value={newGist.filename}
          onChange={(e) => setNewGist({ ...newGist, filename: e.target.value })}
        />
        <textarea
          placeholder="Code snippet..."
          className="border p-2 w-full mb-2 rounded"
          rows={3}
          value={newGist.content}
          onChange={(e) => setNewGist({ ...newGist, content: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600" onClick={createGist}>
          Create Gist
        </button>
      </div>
    </div>
  </div>
) : (
  <p className="text-3xl text-center mt-20 font-light animate-bounce">Please sign in.</p>
);

}



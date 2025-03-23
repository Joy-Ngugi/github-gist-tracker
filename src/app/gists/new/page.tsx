"use client";
import { useForm } from "react-hook-form";
import axios from "axios";

// Define the type for the form data
interface GistFormData {
  description: string;
  content: string;
}

export default function NewGist() {
  const { register, handleSubmit } = useForm<GistFormData>();

  async function createGist(data: GistFormData) {
    await axios.post("https://api.github.com/gists", {
      description: data.description,
      public: true,
      files: {
        "file1.txt": { content: data.content },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(createGist)}>
      <input {...register("description")} placeholder="Gist Description" />
      <textarea {...register("content")} placeholder="Gist Content" />
      <button type="submit">Create Gist</button>
    </form>
  );
}


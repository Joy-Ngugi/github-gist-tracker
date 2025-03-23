import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export default function ProfileForm({ user }) {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: user });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put('/api/profile', { ...data, id: user._id });
      alert('Profile updated');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('name')} placeholder="Name" className="border p-2 w-full" />
      <input {...register('bio')} placeholder="Bio" className="border p-2 w-full" />
      <input {...register('avatar')} placeholder="Avatar URL" className="border p-2 w-full" />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
}

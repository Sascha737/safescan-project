"use client";
import { useSession } from "next-auth/react";

export default function ProfileViewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user?.profilePicture && (
        <div className="flex justify-center mb-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
      )}
      <div className="mb-2">
        <span className="font-medium">Display Name: </span>
        {user?.displayName || <span className="text-gray-500">Not set</span>}
      </div>
      <div className="mb-2">
        <span className="font-medium">Email: </span>
        {user?.email}
      </div>
      <div className="mb-2">
        <span className="font-medium">Bio: </span>
        {user?.bio || <span className="text-gray-500">Not set</span>}
      </div>
    </div>
  );
}

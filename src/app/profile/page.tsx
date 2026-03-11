
// User profile page for editing display name, profile picture, and bio
"use client";

import { useState, useEffect } from "react"; // React state and effect hooks
import { useSession } from "next-auth/react"; // NextAuth session management


// Profile form component
export default function ProfilePage() {
  const { data: session, update } = useSession();
  // Form state for profile fields
  const [form, setForm] = useState({
    displayName: "",
    profilePicture: "",
    bio: "",
  });
  const [status, setStatus] = useState("");

  // Populate form with session user data on load
  useEffect(() => {
    if (session?.user) {
      setForm({
        displayName: session.user.displayName || "",
        profilePicture: session.user.profilePicture || "",
        bio: session.user.bio || "",
      });
    }
  }, [session]);

  // Handle input changes for all fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission and update profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    // Send updated profile data to API
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("Profile updated!");
      // Update session with new profile data
      await update({
        displayName: form.displayName,
        profilePicture: form.profilePicture,
        bio: form.bio,
      });
    } else {
      let errorMsg = "Failed to update profile.";
      try {
        const data = await res.json();
        if (data?.error) errorMsg += ` ${data.error}`;
        if (data?.details) errorMsg += ` (${data.details})`;
      } catch {}
      setStatus(errorMsg);
    }
  };

  // Render profile edit form UI
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display name input */}
        <div>
          <label className="block font-medium">Display Name</label>
          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Profile picture upload */}
        <div>
          <label className="block font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('file', file);
              setStatus('Uploading image...');
              // Upload image to API
              const res = await fetch('/api/profile/upload-image', {
                method: 'POST',
                body: formData,
              });
              if (res.ok) {
                const data = await res.json();
                setForm(f => ({ ...f, profilePicture: data.url }));
                setStatus('Image uploaded!');
              } else {
                setStatus('Failed to upload image.');
              }
            }}
            className="w-full border rounded px-3 py-2"
          />
          {/* Show image preview if uploaded */}
          {form.profilePicture && (
            <div className="flex justify-center mt-2">
              <img
                src={form.profilePicture}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>
        {/* Bio input */}
        <div>
          <label className="block font-medium">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>
        {/* Submit button */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
      {/* Status message display */}
      {status && <div className="mt-4 text-center">{status}</div>}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link href="/">SafeScan</Link>
      </h1>
      <nav className="flex items-center gap-4">
        <Link href="/resources" className="inline-block px-3 py-1 bg-white text-blue-600 rounded shadow hover:bg-gray-100 transition">
          Resources
        </Link>
        {session?.user ? (
          <>
            <Link href="/profile" className="inline-block px-3 py-1 bg-white text-blue-600 rounded shadow hover:bg-gray-100 transition">
              Profile
            </Link>
            <Link href="/history" className="inline-block px-3 py-1 bg-white text-blue-600 rounded shadow hover:bg-gray-100 transition">
              History
            </Link>
            <Link href="/profile" className="inline-block ml-2">
              <span style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {session.user.profilePicture ? (
                  <img
                    src={session.user.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-contain border bg-white"
                    style={{ minWidth: 32, minHeight: 32, maxWidth: 32, maxHeight: 32, display: 'block' }}
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-gray-300 border block" />
                )}
              </span>
            </Link>
            <span
              className="text-sm font-medium ml-2 cursor-pointer"
              title={session.user.email}
            >
              {session.user.displayName || session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="underline ml-4"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="inline-block px-3 py-1 bg-white text-blue-600 rounded shadow hover:bg-gray-100 transition">
              Log in
            </Link>
            <Link href="/register" className="inline-block px-3 py-1 bg-white text-blue-600 rounded shadow hover:bg-gray-100 transition">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

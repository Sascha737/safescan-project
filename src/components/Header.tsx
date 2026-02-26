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
      <nav>
        {session?.user ? (
          <>
            <Link href="/history" className="mr-4 inline-block px-3 py-1 bg-white text-blue-600 rounded shadow hover:bg-gray-100 transition">
              History
            </Link>
            <span className="mr-4">{session.user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="underline"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="mr-4 inline-block px-3 py-1 bg-white text-blue-600 rounded shadow hover:bg-gray-100 transition">
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

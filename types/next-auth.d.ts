import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    displayName?: string | null;
    profilePicture?: string | null;
    bio?: string | null;
  }
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string | null;
      image?: string | null;
      displayName?: string | null;
      profilePicture?: string | null;
      bio?: string | null;
    };
  }
}

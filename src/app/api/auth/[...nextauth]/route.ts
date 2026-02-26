import NextAuth, { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail } from '../../../../../lib/user';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // Simple email/password auth
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined,
        req: any
      ) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await findUserByEmail(credentials.email);
        if (user) {
          const valid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (valid) {
            return { id: user.id, email: user.email };
          }
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' as SessionStrategy },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        // Add user info to token
        token.isStudent = true;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = session.user || {};
      (session.user as any).isStudent = token.isStudent;
      // Copy id & email into session.user
      if (token.id) session.user.id = token.id;
      if (token.email) session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

// Export GET/POST handlers for Next.js app router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


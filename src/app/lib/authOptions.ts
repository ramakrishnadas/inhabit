import CredentialsProvider from 'next-auth/providers/credentials';
import pool from '@/app/lib/db';
import { comparePasswords } from '@/app/lib/utils';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Authentication options

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        // Query PostgreSQL database
        const result = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [credentials.email]
        );

        const user = result.rows[0];

        if (
          !user ||
          !(await comparePasswords(credentials.password, user.password))
        ) {
          throw new Error('Invalid credentials');
        }

        // Return a user object to NextAuth
        return { id: user.id, name: user.nombre, email: user.email };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session, token: JWT }) {
      // Attach the user ID to the session
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT, user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      }
    }) {
      // `user` is only available at login
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' as const },
};

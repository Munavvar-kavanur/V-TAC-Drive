import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                await dbConnect();

                // Explicitly include password as it's not selected by default
                const user = await User.findOne({ email: credentials.email }).select('+password');

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error('Incorrect password');
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };
            }
        })
    ],
    pages: {
        signIn: '/login', // Custom login page
        error: '/login', // Error code passed in query string as ?error=
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

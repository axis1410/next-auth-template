import { connectToDatabase } from "@/helpers/serverHelpers";
import prisma from "@/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "johndoe@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _) {
        if (!credentials || !credentials.email || !credentials.password) return null;

        await connectToDatabase();

        try {
          const user = await prisma.user.findFirst({ where: { email: credentials.email } });

          if (!user) return null;
          if (!user?.hashedPassword) return null;

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user?.hashedPassword
          );

          if (isPasswordCorrect) return user;

          return null;
        } catch (error) {
          console.log(error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

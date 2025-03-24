// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/lib/mongodb"; 

// export const authOptions = {
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// ✅ Ensure Next.js correctly exports the route
export const GET = handler;
export const POST = handler;






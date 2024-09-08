import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./authconfig";
import { connectToDB } from "./lib/utils";
import { User } from "./lib/models";
import bcrypt from "bcrypt";

const login = async (credentials) => {
  try {
    connectToDB();
    const user = await User.findOne({ username: credentials.username });

    //console.log("user ciaoo");
    //console.log(credentials.username, user);

    
    if (!user || !user.isAdmin) throw new Error("Wrong credentials!**");

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    // console.log("pass ciaoo");
    //console.log(credentials.password, user.password);

    console.log('qui arrivo');
    if (isPasswordCorrect) throw new Error("Wrong credentials! ciaoooo");

    console.log("ciaoo userr");
    console.log(user);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to login!");
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          // qui errore non puo essere vuoto e se vuoto ti manda come se esiste
          //return null;
          //console.log();
          throw new Error("Wrong credentials!**");
        }
      },
    }),
  ],

  // ADD ADDITIONAL INFORMATION TO SESSION
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        //token.img = user.img;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        // session.user.img = token.img;
      }
      return session;
    },
  },
});

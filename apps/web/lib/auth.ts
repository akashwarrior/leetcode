import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: process.env.BASE_URL ?? "http://localhost:3000",

  database: prismaAdapter({}, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      userName: {
        type: "string",
        required: true,
        input: true,
        unique: true,
      },
      role: {
        type: ["user", "admin"],
        required: false,
        defaultValue: "user",
        input: false,
      },
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    }
  },

  experimental: { joins: true },

  plugins: [nextCookies()] // make sure this is the last plugin in the array
})

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma, Role } from "@codearena/db";

export const auth = betterAuth({
  baseURL: process.env.BASE_URL ?? "http://localhost:3000",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
        unique: true,
      },
      role: {
        type: [Role.ADMIN, Role.USER],
        required: true,
        defaultValue: Role.USER,
        input: false,
        unique: false,
      },
      githubUrl: {
        type: "string",
        input: true,
        required: false,
        unique: false,
      },
      streak: {
        type: "number",
        input: false,
        required: true,
        defaultValue: 0,
        unique: false,
      },
      globalRank: {
        type: "number",
        input: false,
        required: false,
        unique: false,
      },
      rating: {
        type: "number",
        input: false,
        required: false,
        unique: false,
      },
      solvedEasy: {
        type: "number",
        input: false,
        required: true,
        defaultValue: 0,
        unique: false,
      },
      solvedMedium: {
        type: "number",
        input: false,
        required: true,
        defaultValue: 0,
        unique: false,
      },
      solvedHard: {
        type: "number",
        input: false,
        required: true,
        defaultValue: 0,
        unique: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        async before(user) {
          return {
            data: {
              ...user,
              username: user.username || user.email.split("@")[0],
            },
          };
        },
      },
    },
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
      prompt: "select_account" as const,
    },
  },

  experimental: { joins: true },

  plugins: [nextCookies()], // make sure this is the last plugin in the array
});

export type Session = typeof auth.$Infer.Session;

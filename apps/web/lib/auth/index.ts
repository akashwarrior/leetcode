import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma, Role } from "@codearena/db";
import { randomBytes } from "node:crypto";

function stripSpecialChars(str: string) {
  return str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function getBaseUsername(user: { name?: string; email: string }) {
  let username = stripSpecialChars(user.name?.split(" ")[0] || "");
  if (!username || username.length < 3) {
    username = stripSpecialChars(user.email.split("@")[0]);
  }

  return username.length < 3 ? `${username || "user"}coder` : username;
}

function withSuffix(base: string, suffix: string) {
  const MAX_USERNAME_LENGTH = 30;
  const trimmedBase = base.slice(0, MAX_USERNAME_LENGTH - suffix.length - 1);

  return `${trimmedBase}_${suffix}`;
}

async function generateUniqueUsername(user: {
  username?: string;
  name?: string;
  email: string;
}) {
  const base = getBaseUsername(user);

  const usernames = [base];
  for (let i = 0; i < 14; ++i) {
    usernames.push(withSuffix(base, randomBytes(2).toString("hex")));
  }

  const existingUsers = await prisma.user.findMany({
    where: { username: { in: usernames } },
    select: { username: true },
  });

  const taken = new Set(existingUsers.map((u) => u.username));
  const available = usernames.find((c) => !taken.has(c));

  return available || withSuffix(base, randomBytes(4).toString("hex"));
}

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
        before: async (user) => ({
          data: {
            ...user,
            username: await generateUniqueUsername(user),
          },
        }),
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

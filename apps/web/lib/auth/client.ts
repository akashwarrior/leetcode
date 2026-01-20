import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from ".";
import useSWR from "swr";

const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const {
  getSession,
  signIn,
  signOut,
  updateUser,
  signUp,
  changePassword,
  revokeOtherSessions,
  deleteUser,
} = authClient;

export const useSession = () =>
  useSWR<Session | null>("session", async () => (await getSession()).data, {
    dedupingInterval: 1000 * 60 * 5,
  });

export type Session = typeof authClient.$Infer.Session;

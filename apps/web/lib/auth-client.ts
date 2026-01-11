import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { useSession, signIn, signOut, updateUser, signUp } = authClient;

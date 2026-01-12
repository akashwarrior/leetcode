export const MOCK_AUTH_COOKIE = "mock_auth";

export function isMockAuthenticated(cookieValue: string | undefined) {
  return cookieValue === "1";
}

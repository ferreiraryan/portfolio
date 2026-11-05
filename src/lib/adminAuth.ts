import { cookies } from "next/headers";

export function getExpectedToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD?.trim();
  if (!secret) return null;
  return Buffer.from(`admin_session_auth:${secret}`).toString("base64");
}

export async function isAuthenticated(): Promise<boolean> {
  const expectedToken = getExpectedToken();
  if (!expectedToken) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return Boolean(session && session === expectedToken);
}

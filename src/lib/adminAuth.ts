import { cookies } from "next/headers";

const FALLBACK_PASSWORD = "rf290407";

export function getExpectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD;
  return Buffer.from(`admin_session_auth:${secret}`).toString("base64");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return session === getExpectedToken();
}

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "campuscare-default-jwt-secret-key-32chars";
const TOKEN_NAME = "campuscare_session";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  department?: string | null;
  avatar?: string | null;
}

export function signToken(user: UserSession): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getUserFromRequest(request: NextRequest): UserSession | null {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { TOKEN_NAME };

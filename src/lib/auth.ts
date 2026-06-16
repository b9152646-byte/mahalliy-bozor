import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mahalliy-bozor-maxfiy-kalit-2024"
);

export interface SessionUser {
  id: string;
  name: string;
  email: string | null;
  login: string | null;
  phone: string | null;
  isAdmin: boolean;
  isBanned: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    login: user.login,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isBanned: user.isBanned,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: (payload.email as string) || null,
      login: (payload.login as string) || null,
      phone: (payload.phone as string) || null,
      isAdmin: payload.isAdmin as boolean,
      isBanned: payload.isBanned as boolean,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const session = await verifyToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      login: true,
      phone: true,
      isAdmin: true,
      isBanned: true,
    },
  });

  if (!user || user.isBanned) return null;
  return user;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function checkDuplicateUser(data: {
  email?: string;
  login?: string;
  phone?: string;
}): Promise<string | null> {
  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return "Bu foydalanuvchi allaqachon mavjud";
  }
  if (data.login) {
    const existing = await prisma.user.findUnique({ where: { login: data.login } });
    if (existing) return "Bu foydalanuvchi allaqachon mavjud";
  }
  if (data.phone) {
    const existing = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existing) return "Bu foydalanuvchi allaqachon mavjud";
  }
  return null;
}


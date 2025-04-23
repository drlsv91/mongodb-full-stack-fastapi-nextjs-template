"use server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type SessionUser = {
  id?: string;
  name?: string;
  avatar?: string;
  email: string;
  role?: string;
};

export type Session = {
  user: SessionUser;
  accessToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;

const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  try {
    const session = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);

    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    (await cookies()).set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiredAt,
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (err) {
    console.error("Failed to verify the session: ", err);

    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

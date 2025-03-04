import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NewUser } from '@/lib/db/schema';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);
const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword);
}

type SessionData = {
  user: { id: string };
  expires: string;
};

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 day from now')
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}

import { auth } from "../../auth"
import { NextResponse } from 'next/server';

export async function getSession(authMethod ?: Function | null) {
  const credentialsSession = (await cookies()).get('session')?.value;
  if (!credentialsSession) {
    // console.log(authMethod == null ? "Not" : "", "using authMethod")
    const session = authMethod ? await authMethod() : await auth();
    if (!session) {
      return null;
    }
    return session;
  };
  let res = NextResponse.next();

  const parsed = await verifyToken(credentialsSession);
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

  res.cookies.set({
    name: 'session',
    value: await signToken({
      ...parsed,
      expires: expiresInOneDay.toISOString(),
    }),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: expiresInOneDay,
  });

  return parsed;
}

export async function setSession(user: NewUser) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session: SessionData = {
    user: { id: user.id! },
    expires: expiresInOneDay.toISOString(),
  };
  const encryptedSession = await signToken(session);
  (await cookies()).set('session', encryptedSession, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
}

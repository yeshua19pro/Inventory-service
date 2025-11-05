import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const backend = process.env.API_USER_URL || "http://localhost:8000";
  const resp = await fetch(`${backend}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await resp.json();

  if (!resp.ok) {
    return NextResponse.json(data, { status: resp.status });
  }

  const token = data.access_token;
  const maxAge = 60 * 60 * 24 * 7;

  const res = NextResponse.json({ ok: true });
  // Set cookie HttpOnly, Secure en producción, SameSite=lax
  res.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}

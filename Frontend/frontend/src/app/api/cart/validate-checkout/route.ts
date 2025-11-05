import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const backend = process.env.API_CART_URL || "http://localhost:8010";
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });
  }

  const res = await fetch(`${backend}/cart/validate-checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

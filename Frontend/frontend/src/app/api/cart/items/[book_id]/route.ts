import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const backend = process.env.API_CART_URL || "http://localhost:8010";

export async function POST(req: Request, context: { params: Promise<{ book_id: string }> }) {
  const { book_id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token)
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });

  const res = await fetch(`${backend}/cart/items/${book_id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: Request, context: { params: Promise<{ book_id: string }> }) {
  const { book_id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token)
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });

  const res = await fetch(`${backend}/cart/items/${book_id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: Request, context: { params: Promise<{ book_id: string }> }) {
  const { book_id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token)
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });

  const res = await fetch(`${backend}/cart/items/${book_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

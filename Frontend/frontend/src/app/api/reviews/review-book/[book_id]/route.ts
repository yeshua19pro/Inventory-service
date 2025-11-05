import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const backend = process.env.API_REVIEW_URL || "http://localhost:8069";

export async function POST(req: Request, context: { params: Promise<{ book_id: string }> }) {
  const { book_id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${backend}/reviews/review-book/${book_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

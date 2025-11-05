import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const backend = process.env.API_CATALOG_URL || "http://localhost:8080";
  const body = await req.json();

  if (!token) {
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });
  }

  const res = await fetch(`${backend}/catalog/filter_book`, {
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

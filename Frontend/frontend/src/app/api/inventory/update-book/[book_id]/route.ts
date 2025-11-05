import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  context: { params: Promise<{ book_id: string }> }
) {
  const { book_id } = await context.params;
  const token = (await cookies()).get("auth_token")?.value;
  const body = await req.json();
  const backend = process.env.API_INVENTARIO_URL || "http://localhost:8020";

  if (!token) {
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });
  }

  try {
    const res = await fetch(`${backend}/inventory/update-book/${book_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error al actualizar inventario:", error);
    return NextResponse.json(
      { detail: "Error interno del cliente Inventory." },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  _req: Request,
  context: { params: Promise<{ book_id: string }> }
) {
  const { book_id } = await context.params;
  const backend = process.env.API_INVENTARIO_URL|| "http://localhost:8020";

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No autenticado: no hay token en las cookies." },
        { status: 401 }
      );
    }

    const res = await fetch(`${backend}/inventory/check-book/${book_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error del backend:", errorText);
      return NextResponse.json(
        { message: "Error en el backend", details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error al consultar el inventario:", error);
    return NextResponse.json(
      { message: "Error interno en el proxy", error: String(error) },
      { status: 500 }
    );
  }
}

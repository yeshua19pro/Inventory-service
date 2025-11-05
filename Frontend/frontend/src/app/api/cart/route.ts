import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const backend = process.env.API_CART_URL || "http://localhost:8010";

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ detail: "No autenticado" }, { status: 401 });
    }

    const res = await fetch(`${backend}/cart/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Error obteniendo carrito:", err);
    return NextResponse.json({ detail: "Error interno" }, { status: 500 });
  }
}

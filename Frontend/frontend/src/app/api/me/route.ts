import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "No autenticado" }, { status: 401 });
  }

  const backend = process.env.API_USER_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${backend}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error al obtener perfil:", errorText);
      return NextResponse.json({ detail: "Error al obtener perfil" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error de conexión con user_service:", error);
    return NextResponse.json({ detail: "Error interno del servidor" }, { status: 500 });
  }
}

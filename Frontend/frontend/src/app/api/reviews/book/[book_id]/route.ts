import { NextResponse } from "next/server";

const backend = process.env.API_REVIEW_URL || "http://localhost:8069";

export async function GET(
  req: Request,
  context: { params: Promise<{ book_id: string }> }
) {
  try {

    const { book_id } = await context.params;


    const res = await fetch(`${backend}/reviews/book/${book_id}`, {
      method: "GET",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { detail: errorData.detail || "Error al obtener reseñas" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en /api/reviews/book/[book_id]:", error);
    return NextResponse.json(
      { detail: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

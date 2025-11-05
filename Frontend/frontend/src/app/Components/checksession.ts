import { cookies } from "next/headers";

export async function checkSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const backend = process.env.API_USER_API || "http://localhost:8000";

  try {
    const res = await fetch(`${backend}/users/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Error verificando sesión:", err);
    return null;
  }
}

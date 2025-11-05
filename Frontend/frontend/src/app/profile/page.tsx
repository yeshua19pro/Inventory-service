import { cookies } from "next/headers";
import LogoutButton from "../Components/LogoutButton";

async function fetchProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const backend = process.env.API_USER_API || "http://localhost:8000";
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
}

export default async function ProfilePage() {
  const profile = await fetchProfile();

  if (!profile) {
    return (
      <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
          <h1 className="text-3xl font-semibold text-gray-800 mb-3">
            No autenticado
          </h1>
          <p className="text-gray-600 mb-6">
            Por favor inicia sesión para ver tu perfil.
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Ir a Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Bienvenido, {profile.user_name}
        </h1>
        <p className="text-gray-500 mb-6">Aquí están tus datos personales</p>

        <div className="text-left space-y-3">
          <div>
            <p className="font-semibold text-gray-800">Nombre completo:</p>
            <p className="text-gray-600">
              {profile.user_name} {profile.user_lastname}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-800">Email:</p>
            <p className="text-gray-600">{profile.user_email}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-800">Rol:</p>
            <p className="text-gray-600 capitalize">{profile.user_role}</p>
          </div>

          {profile.user_creation_date && (
            <div>
              <p className="font-semibold text-gray-800">Miembro desde:</p>
              <p className="text-gray-600">{profile.user_creation_date}</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-6">
        Servicio de Autenticación © 2025
      </p>
    </main>
  );
}

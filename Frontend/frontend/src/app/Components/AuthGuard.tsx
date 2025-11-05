import Link from "next/link";

export default function AuthGuard() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          No autenticado
        </h1>
        <p className="text-gray-600 mb-6">
          Por favor inicia sesión para acceder a esta sección.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Ir a Login
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function CatalogPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg text-center border border-blue-100">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Catálogo</h1>
        <p className="text-gray-600 mb-8">
          Gestiona y consulta los libros del sistema.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/Catalog/register"
            className="bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition text-lg"
          >
            Registrar libro
          </Link>
          <Link
            href="/Catalog/filter"
            className="bg-green-500 text-white py-3 rounded-lg shadow hover:bg-green-600 transition text-lg"
          >
            Buscar libros
          </Link>
        </div>
      </div>
    </main>
  );
}

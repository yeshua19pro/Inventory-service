"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterBook() {
  const [form, setForm] = useState({
    book_name: "",
    author: "",
    book_type: "",
    price: "",
    publication_date: "",
    description: "",
    stock: "",
    image: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      const res = await fetch("/api/Catalog/Register_Book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          publication_date: new Date(form.publication_date).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al registrar el libro.");
      setMessage("Libro registrado correctamente.");
      setForm({
        book_name: "",
        author: "",
        book_type: "",
        price: "",
        publication_date: "",
        description: "",
        stock: "",
        image: "",
      });
    } catch (err: any) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-blue-100"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Registrar nuevo libro
        </h2>

        <input
          name="book_name"
          placeholder="Nombre del libro"
          value={form.book_name}
          onChange={(e) => setForm({ ...form, book_name: e.target.value })}
          required
          className="text-black w-full mb-3 p-2 border rounded-lg focus:outline-blue-500"
        />
        <input
          name="author"
          placeholder="Autor"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
          className="text-black w-full mb-3 p-2 border rounded-lg focus:outline-blue-500"
        />
        <input
          name="book_type"
          placeholder="Tipo o género"
          value={form.book_type}
          onChange={(e) => setForm({ ...form, book_type: e.target.value })}
          required
          className="text-black w-full mb-3 p-2 border rounded-lg focus:outline-blue-500"
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          className="text-black w-full mb-3 p-2 border rounded-lg focus:outline-blue-500"
        />
        <input
          type="date"
          name="publication_date"
          placeholder="Fecha de publicación"
          value={form.publication_date}
          onChange={(e) => setForm({ ...form, publication_date: e.target.value })}
          required
          className="text-black w-full mb-3 p-2 border rounded-lg focus:outline-blue-500"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock disponible"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
          className="text-black w-full mb-3 p-2 border rounded-lg focus:outline-blue-500"
        />
        <input
          name="image"
          placeholder="URL de imagen"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          required
          className="text-black w-full mb-3 p-2 border rounded-lg focus:outline-blue-500"
        />
        <textarea
          name="description"
          placeholder="Descripción (opcional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="text-black w-full mb-3 p-2 border rounded-lg focus:outline-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>

        <button
          type="button"
          className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg shadow hover:bg-gray-700 transition"
        >
          <Link href="/Catalog">Regresar al catálogo</Link>
        </button>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </form>
    </main>
  );
}

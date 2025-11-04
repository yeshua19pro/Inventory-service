"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function InventoryPage() {
  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [stockChange, setStockChange] = useState(0);
  const [modifyType, setModifyType] = useState<"increment" | "decrement">("increment");
  const [message, setMessage] = useState("");

  async function fetchBook() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/inventory/check-book/${bookId}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Libro no encontrado");
      const data = await res.json();
      setBook(data.book);
    } catch (err) {
      console.error(err);
      setBook(null);
      setMessage("No se encontró el libro con ese ID.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStock() {
    if (!book) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/inventory/update-book/${book.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock: Number(stockChange),
          modify_type: modifyType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al actualizar stock");

      setMessage("Stock actualizado correctamente.");
      await fetchBook(); // Refresca datos
    } catch (err: any) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
      setStockChange(0);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Gestión de Inventario
        </h1>

        {/* Buscar libro */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="ID del libro..."
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="flex-1 text-black rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={fetchBook}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Buscar
          </button>
        </div>

        {/* Cargando */}
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-green-500" size={40} />
          </div>
        )}

        {/* Mensajes */}
        {message && (
          <p
            className={`text-center mb-6 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Info del libro */}
        {book && !loading && (
          <div className="border rounded-xl p-6 bg-gray-50 shadow">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">
              {book.book_name}
            </h2>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Autor:</span> {book.author}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Tipo:</span> {book.book_type}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Publicado:</span>{" "}
              {new Date(book.publication_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-3">
              <span className="font-semibold">Stock actual:</span>{" "}
              {book.stock}
            </p>

            {/* Modificar stock */}
            <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
              <select
                value={modifyType}
                onChange={(e) =>
                  setModifyType(e.target.value as "increment" | "decrement")
                }
                className="border rounded-lg px-4 py-2 text-black"
              >
                <option value="increment">Incrementar</option>
                <option value="decrement">Reducir</option>
              </select>

              <input
                type="number"
                min="1"
                value={stockChange}
                onChange={(e) => setStockChange(Number(e.target.value))}
                className="text-black border rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Cantidad"
              />

              <button
                onClick={updateStock}
                disabled={loading || stockChange <= 0}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                Actualizar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

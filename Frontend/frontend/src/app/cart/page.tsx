"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data.cart_info);
    setLoading(false);
  };

  const addItem = async (bookId: string) => {
    await fetch(`/api/cart/items/${bookId}`, { method: "POST" });
    fetchCart();
  };

  const reduceItem = async (bookId: string) => {
    await fetch(`/api/cart/items/${bookId}`, { method: "PATCH" });
    fetchCart();
  };

  const removeItem = async (bookId: string) => {
    await fetch(`/api/cart/items/${bookId}`, { method: "DELETE" });
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-gray-500 animate-pulse">Cargando carrito...</p>
      </div>
    );
  }

  if (!cart || Object.entries(cart.cart_items || {}).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-600">
        <ShoppingCart className="w-16 h-16 mb-4 text-gray-400" />
        <p className="text-lg">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900">
          <ShoppingCart className="w-7 h-7 text-blue-600" />
          Tu Carrito
        </h1>

        <div className="space-y-4">
          {Object.entries(cart.cart_items).map(([id, item]: any, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div>
                <p className="text-gray-900 text-lg font-medium">
                  {item.book_name || "Libro sin título"}
                </p>
                <p className="text-sm text-gray-500">{item.author || "Autor desconocido"}</p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Cantidad:</span> {item.quantity}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Precio total:</span>{" "}
                  ${item.total_price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => reduceItem(id)}
                  className="p-2 rounded-full bg-yellow-50 hover:bg-yellow-100 transition"
                  title="Reducir cantidad"
                >
                  <Minus className="w-4 h-4 text-yellow-600" />
                </button>

                <button
                  onClick={() => addItem(id)}
                  className="p-2 rounded-full bg-green-50 hover:bg-green-100 transition"
                  title="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4 text-green-600" />
                </button>

                <button
                  onClick={() => removeItem(id)}
                  className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
                  title="Eliminar del carrito"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-right border-t pt-6">
          <p className="text-xl font-semibold text-gray-900">
            Total: <span className="text-blue-600">${cart.total_price.toFixed(2)}</span>
          </p>
          <button className="mt-4 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
}

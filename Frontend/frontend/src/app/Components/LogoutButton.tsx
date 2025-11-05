"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch {
      alert("Error al cerrar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition disabled:opacity-60"
    >
      {loading ? "Cerrando sesión..." : "Cerrar sesión"}
    </button>
  );
}

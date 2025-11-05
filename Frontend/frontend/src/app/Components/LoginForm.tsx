"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Credenciales inválidas.");

      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto bg-white p-6 rounded-2xl shadow"
    >
      <h2 className="text-black font-semibold text-center">INICIAR SESIÓN</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Entrar"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <p className="text-black text-center text-sm mt-2">
        ¿No tienes cuenta?{" "}
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => router.push("/register")}
        >
          Regístrate
        </span>
      </p>
    </form>
  );
}

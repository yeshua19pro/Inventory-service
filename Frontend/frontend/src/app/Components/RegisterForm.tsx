"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            last_name: lastName,
            email,
            password,
            address,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error al registrar usuario.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto bg-white p-6 rounded-2xl shadow"
    >
      <h2 className="text-black font-semibold text-center">CREAR CUENTA</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-black border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Apellido"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="text-black border p-2 roundedd"
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="text-black border p-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="text-black border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="text-black border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Registrarme
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">¡Registro exitoso! Redirigiendo...</p>}

      <p className="text-black text-center text-sm mt-2">
        ¿Ya tienes cuenta?{" "}
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => router.push("/login")}
        >
          Inicia sesión
        </span>
      </p>
    </form>
  );
}

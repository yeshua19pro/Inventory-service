"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, BookOpen, Box } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/Catalog", label: "Catálogo", icon: <BookOpen className="w-5 h-5" /> },
    { href: "/inventory", label: "Inventario", icon: <Box className="w-5 h-5" /> },
    { href: "/profile", label: "Perfil", icon: <User className="w-5 h-5" /> },
    { href: "/cart", label: "Carrito", icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          📚 BookStore
        </Link>

        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

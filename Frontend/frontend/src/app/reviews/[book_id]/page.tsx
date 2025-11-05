"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function ReviewPage() {
  const { book_id } = useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  // Obtener reseñas del libro
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/book/${book_id}`);
        const data = await res.json();
        const fetchedReviews = data.reviews || [];
        setReviews(fetchedReviews);

        if (fetchedReviews.length > 0) {
          const avg =
            fetchedReviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
            fetchedReviews.length;
          setAvgRating(parseFloat(avg.toFixed(1)));
        } else {
          setAvgRating(null);
        }
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
      }
    };
    fetchReviews();
  }, [book_id, refresh]);

  // Enviar reseña
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch(`/api/reviews/review-book/${book_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, commentary: comment }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Reseña enviada correctamente");
      setComment("");
      setRating(0);
      setRefresh((r) => !r);
    } else {
      setMessage(`Error: ${data.detail || "No se pudo enviar la reseña"}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Escribir una reseña
        </h1>

        {/* Formulario */}
        <motion.form
          onSubmit={submitReview}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-4"
        >
          {/* Estrellas */}
          <div>
            <label className="text-gray-800 font-semibold mb-2 block">
              Calificación
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition ${
                    star <= (hover || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label className="text-gray-800 block font-semibold mb-2">
              Tu reseña
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe aquí tu opinión sobre el libro..."
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-semibold rounded-lg transition ${
              loading
                ? "bg-gray-400 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Enviando..." : "Enviar reseña"}
          </button>

          {/* Mensaje */}
          {message && (
            <p
              className={`text-center mt-2 font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </motion.form>

        {/* Promedio de calificación */}
        {avgRating !== null && (
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
              Calificación promedio
            </h2>
            <div className="flex justify-center items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-7 h-7 ${
                    star <= Math.round(avgRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-lg font-medium text-gray-700">
                {avgRating} / 5
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Basado en {reviews.length} reseña
              {reviews.length !== 1 ? "s" : ""}.
            </p>
          </div>
        )}

        {/* Reseñas anteriores */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
            Reseñas anteriores
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${
                            s <= Math.round(r.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(r.review_date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{r.commentary}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No hay reseñas todavía.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    // Contoh: fetch ke API (sesuaikan endpoint kamu)
    fetch(`/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data));
  }, [id]);

  if (!book) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Detail Buku</h1>
      <div className="bg-white border rounded p-4 shadow">
        <p><strong>ID:</strong> {book.id}</p>
        <p><strong>Judul:</strong> {book.title}</p>
        <p><strong>Penulis:</strong> {book.author}</p>
        <p><strong>Harga:</strong> Rp{book.price}</p>
      </div>
    </div>
  );
}

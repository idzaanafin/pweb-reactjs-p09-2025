import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

type BookDetail = {
  id: string;
  title: string;
  writer: string;
  publisher?: string;
  price: number;
  stock_quantity: number;
  genreName: string;
  description?: string;
  publication_year?: number | null;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await axios.get(`${API}/books/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const b = res.data.data;

        const mapped: BookDetail = {
          id: String(b.id),
          title: b.title,
          writer: b.writer,
          publisher: b.publisher || "-",
          price: Number(b.price),
          stock_quantity: Number(b.stock_quantity ?? 0),
          genreName: b.genre?.name ?? "-",
          description: b.description ?? "-",
          publication_year: b.publication_year ?? null,
        };

        setBook(mapped);
      } catch (e: any) {
        if (e?.response?.status === 404) setErr("Book not found");
        else setErr(e?.response?.data?.message || "Failed to load book");
        setBook(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <header className="toolbar">
          <h1 className="page-title">Book Detail</h1>
          <Link to="/books" className="btn btn-outline">← Back</Link>
        </header>
        <div className="card pad" style={{ marginTop: 12 }}>Loading...</div>
      </div>
    );
  }

  if (err || !book) {
    return (
      <div className="container">
        <header className="toolbar">
          <h1 className="page-title">Book Detail</h1>
          <Link to="/books" className="btn btn-outline">← Back</Link>
        </header>
        <div className="card pad" style={{ marginTop: 12 }}>
          {err || "Book not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <header className="toolbar">
        <h1 className="page-title">{book.title}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/books" className="btn btn-outline">← Back</Link>
          {/* <Link to={`/books/${book.id}/edit`} className="btn btn-primary">Edit</Link> */}
        </div>
      </header>

      <div className="card pad" style={{ display: "grid", gap: 20 }}>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Info label="Writer" value={book.writer} />
          <Info label="Publisher" value={book.publisher || "-"} />
          <Info label="Genre" value={book.genreName} />
          <Info label="Publication Year" value={book.publication_year ? String(book.publication_year) : "-"} />
          <Info label="Price" value={`Rp ${Intl.NumberFormat("id-ID").format(book.price)}`} />
          <Info label="Stock" value={String(book.stock_quantity)} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="textarea" style={{ background: "#fff", resize: "none" }}>
            {book.description || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="card"
      style={{
        padding: "12px 14px",
        display: "grid",
        gap: 4,
        background: "rgba(255,255,255,0.9)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div className="text-sm" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="font-medium" style={{ color: "var(--text-900)" }}>
        {value || "-"}
      </div>
    </div>
  );
}

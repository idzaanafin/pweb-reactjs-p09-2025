import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type Genre = { id: string; name: string };

type FormState = {
  title: string;
  writer: string;
  publisher: string;
  price: string;
  stock_quantity: string;
  genre_id: string;
  description: string;
  publication_year: string;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    writer: "",
    publisher: "",
    price: "",
    stock_quantity: "",
    genre_id: "",
    description: "",
    publication_year: "",
  });

  // Prefill data buku
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await axios.get(`${API}/books/${id}`, { headers: authHeaders(), withCredentials: true });
        const b = res.data.data;

        setForm({
          title: b.title ?? "",
          writer: b.writer ?? "",
          publisher: b.publisher ?? "",
          price: String(b.price ?? ""),
          stock_quantity: String(b.stock_quantity ?? 0),
          genre_id: String(b.genre?.id ?? b.genre_id ?? ""),
          description: b.description ?? "",
          publication_year: b.publication_year ? String(b.publication_year) : "",
        });

      } catch (e: any) {
        setErr(e?.response?.status === 404 ? "Book not found" : "Failed to load book");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Load genres
  useEffect(() => {
    (async () => {
      try {
        setLoadingGenres(true);
        const res = await axios.get(`${API}/genre`, { headers: authHeaders(), withCredentials: true });
        const data = Array.isArray(res.data.data) ? res.data.data : [];

        setGenres(
          data.map((g: any) => ({
            id: String(g.id),
            name: String(g.name),
          }))
        );
      } catch {
        setGenres([]);
      } finally {
        setLoadingGenres(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.writer.trim()) {
      alert("Title & Writer wajib diisi.");
      return;
    }
    if (!form.genre_id) {
      alert("Genre wajib dipilih.");
      return;
    }

    const priceNum = Number(form.price);
    const stockNum = Number(form.stock_quantity);

    if (isNaN(priceNum) || priceNum < 0) {
      alert("Harga tidak boleh kosong atau negatif!");
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      alert("Stock harus bilangan bulat dan tidak boleh negatif!");
      return;
    }

    const payload = {
      title: form.title,
      writer: form.writer,
      publisher: form.publisher || undefined,
      price: priceNum,
      stock_quantity: stockNum,
      genre_id: form.genre_id,
      description: form.description || undefined,
      publication_year: form.publication_year ? Number(form.publication_year) : undefined,
    };

    try {
      setSubmitting(true);
      await axios.patch(`${API}/books/${id}`, payload, { headers: authHeaders() });
      alert("✅ Buku berhasil diperbarui!");
      navigate(`/books/${id}`);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Gagal update buku.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="container"><div className="card pad mt-4">Loading...</div></div>
  );

  if (err) return (
    <div className="container"><div className="card pad mt-4">{err}</div></div>
  );

  return (
    <div className="container">
      <header className="toolbar">
        <h1 className="page-title">Edit Book</h1>
        <Link to={`/books/${id}`} className="btn btn-outline">← Back</Link>
      </header>

      <form onSubmit={onSubmit} className="card pad" style={{ display: "grid", gap: 12 }}>
        <Input label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Writer *" value={form.writer} onChange={(v) => setForm({ ...form, writer: v })} />
        <Input label="Publisher" value={form.publisher} onChange={(v) => setForm({ ...form, publisher: v })} />

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Price" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <Input label="Stock" type="number" value={form.stock_quantity} onChange={(v) => setForm({ ...form, stock_quantity: v })} />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label className="subtle">Genre</label>
          <select
            className="select"
            value={form.genre_id}
            onChange={(e) => setForm({ ...form, genre_id: e.target.value })}
            disabled={loadingGenres}
          >
            <option value="">-</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <Input
          label="Publication Year"
          type="number"
          value={form.publication_year}
          onChange={(v) => setForm({ ...form, publication_year: v })}
        />

        <div style={{ display: "grid", gap: 6 }}>
          <label className="subtle">Description</label>
          <textarea
            className="textarea"
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Link to={`/books/${id}`} className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={submitting || loadingGenres}>
            {submitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label className="subtle">{label}</label>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

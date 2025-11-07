import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

type Genre = { id: string; name: string };

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";

export default function AddBook() {
  const navigate = useNavigate();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form, setForm] = useState({
    title: "",
    writer: "",
    publisher: "",
    price: "",
    stock_quantity: "",
    genre_id: "",
    description: "",
    publication_year: "",
  });

  // Ambil daftar genre
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);
        const token = getToken();
        const res = await axios.get(`${API}/genre`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const data = Array.isArray(res.data) ? res.data : [];

        setGenres(
          data.map((g: any) => ({
            id: String(g.id),
            name: String(g.name),
          }))
        );
      } catch (err) {
        console.error("⚠️ Gagal fetch genres:", err);
        setGenres([]);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  // Submit form
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
      alert("Stock harus berupa bilangan bulat dan tidak boleh negatif!");
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
      publication_year: form.publication_year
        ? Number(form.publication_year)
        : undefined,
    };

    try {
      setSubmitting(true);
      await axios.post(`${API}/books`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          withCredentials: true,
        },
      });

      alert("✅ Buku berhasil ditambahkan!");
      navigate("/books");

    } catch (err: any) {
      console.error("❌ Gagal menambahkan buku:", err);
      alert(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <header className="toolbar">
        <h1 className="page-title">Add Book</h1>
        <Link to="/books" className="btn btn-outline">
          ← Back
        </Link>
      </header>

      <form
        onSubmit={onSubmit}
        className="card pad"
        style={{ display: "grid", gap: 12 }}
      >
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
            <option value="">{loadingGenres ? "Loading..." : "-"}</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
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

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
          <Link to="/books" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={submitting || loadingGenres}>
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label className="subtle">{label}</label>
      <input
        className="input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

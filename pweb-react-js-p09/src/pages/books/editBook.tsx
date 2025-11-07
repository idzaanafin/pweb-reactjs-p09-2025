import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type Genre = { id: string; name: string };

type FormState = {
  title: string;
  writer: string;
  publisher: string;
  price: string;
  stock: string;
  genreId: string;       // UUID genre
  isbn: string;
  description: string;
  publication_year: string;
  condition: string;     // "new" | "used" | ""
};

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
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
    stock: "",
    genreId: "",
    isbn: "",
    description: "",
    publication_year: "",
    condition: "",
  });

  // Prefill data buku
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API}/books/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) {
          setErr(res.status === 404 ? "Book not found" : "Failed to load book");
          return;
        }
        const b = await res.json();
        setForm({
          title: b.title ?? "",
          writer: b.writer ?? "",
          publisher: b.publisher ?? "",
          price: String(b.price ?? ""),
          stock: String(b.stock ?? ""),
          genreId: b.genre?.id ?? b.genreId ?? "",
          isbn: b.isbn ?? "",
          description: b.description ?? "",
          publication_year: b.publication_year ? String(b.publication_year) : "",
          condition: b.condition ?? "",
        });
      } catch {
        setErr("Failed to load book");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Ambil daftar genre
  useEffect(() => {
    (async () => {
      try {
        setLoadingGenres(true);
        const res = await fetch(`${API}/genres`, { headers: authHeaders() });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const mapped: Genre[] = (Array.isArray(data) ? data : []).map((g: any) => ({
          id: String(g.id ?? g.genreId ?? ""),
          name: String(g.name ?? g.genreName ?? "-"),
        }));
        setGenres(mapped);
      } catch {
        // optional fallback kalau /genres belum siap
        setGenres([
          { id: "b34b1576-9613-4461-84e1-cbeea61df1db", name: "Technology" },
          { id: "11111111-1111-1111-1111-111111111111", name: "Fiction" },
          { id: "22222222-2222-2222-2222-222222222222", name: "History" },
        ]);
      } finally {
        setLoadingGenres(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validasi minimal
    if (!form.title.trim() || !form.writer.trim()) {
      alert("Title & Writer wajib diisi.");
      return;
    }
    if (!form.genreId) {
      alert("Genre wajib dipilih.");
      return;
    }

    const priceNum = Number(form.price);
    const stockNum = Number(form.stock);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("Harga tidak boleh kosong atau negatif!");
      return;
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      alert("Stok harus bilangan bulat dan tidak boleh negatif!");
      return;
    }

    const payload = {
      title: form.title,
      writer: form.writer,
      publisher: form.publisher || undefined,
      price: priceNum,
      stock: stockNum,
      genreId: form.genreId, // kirim UUID genre
      isbn: form.isbn || undefined,
      description: form.description || undefined,
      publication_year: form.publication_year ? Number(form.publication_year) : undefined,
      condition: form.condition || undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API}/books/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        alert("Gagal update buku.\n" + msg);
        return;
      }
      alert("Buku diperbarui.");
      navigate(`/books/${id}`);
    } catch {
      alert("Terjadi kesalahan saat update buku.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <header className="toolbar">
          <h1 className="page-title">Edit Book</h1>
          <Link to={`/books/${id}`} className="btn btn-outline">← Back</Link>
        </header>
        <div className="card pad" style={{ marginTop: 12 }}>Loading...</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container">
        <header className="toolbar">
          <h1 className="page-title">Edit Book</h1>
          <Link to="/books" className="btn btn-outline">← Back</Link>
        </header>
        <div className="card pad" style={{ marginTop: 12 }}>{err}</div>
      </div>
    );
  }

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
          <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label className="subtle">Genre</label>
            <select
              className="select"
              value={form.genreId}
              onChange={(e) => setForm({ ...form, genreId: e.target.value })}
              disabled={loadingGenres}
            >
              <option value="">{loadingGenres ? "Loading..." : "-"}</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label className="subtle">Condition</label>
            <select
              className="select"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            >
              <option value="">-</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>
        </div>

        <Input label="ISBN" value={form.isbn} onChange={(v) => setForm({ ...form, isbn: v })} />
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
          <Link to={`/books/${id}`} className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={submitting || loadingGenres}>
            {submitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label, value, onChange, type = "text",
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

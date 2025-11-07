import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Genre = { id: number; name: string };

const GENRES: Genre[] = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Technology" },
  { id: 3, name: "History" },
];

export default function AddBook() {
  const navigate = useNavigate();
  // 🔒 guard login (sementara dinonaktifkan)
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) navigate("/login", { replace: true });
  // }, [navigate]);

  
  const [form, setForm] = useState({
    title: "",
    writer: "",
    publisher: "",
    price: "",
    stock: "",
    genre: "",
    isbn: "",
    description: "",
    publication_year: "",
    condition: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mock: buku ditambahkan!\n" + JSON.stringify(form, null, 2));
    navigate("/books");
  };

  return (
    <div className="container">
      <header className="toolbar">
        <h1 className="page-title">Add Book</h1>
        <Link to="/books" className="btn btn-outline">← Back</Link>
      </header>

      <form onSubmit={onSubmit} className="card pad" style={{ display: "grid", gap: 12 }}>
        {/* Baris 1 */}
        <Input label="Title *" value={form.title} onChange={v => setForm({ ...form, title: v })} />
        <Input label="Writer *" value={form.writer} onChange={v => setForm({ ...form, writer: v })} />
        <Input label="Publisher" value={form.publisher} onChange={v => setForm({ ...form, publisher: v })} />

        {/* Baris 2 */}
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Price" type="number" value={form.price} onChange={v => setForm({ ...form, price: v })} />
          <Input label="Stock" type="number" value={form.stock} onChange={v => setForm({ ...form, stock: v })} />
        </div>

        {/* Baris 3 */}
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label className="subtle">Genre</label>
            <select
              className="select"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
            >
              <option value="">-</option>
              {GENRES.map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
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

        {/* Baris 4 */}
        <Input label="ISBN" value={form.isbn} onChange={v => setForm({ ...form, isbn: v })} />
        <Input
          label="Publication Year"
          type="number"
          value={form.publication_year}
          onChange={v => setForm({ ...form, publication_year: v })}
        />

        {/* Baris 5 */}
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
          <button type="submit" className="btn btn-primary">Save</button>
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

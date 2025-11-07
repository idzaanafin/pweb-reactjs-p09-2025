import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

type Genre = { id: string; name: string };
type Book = {
  id: number;
  title: string;
  writer: string;
  price: number;
  stock: number;
  genre: Genre;              // { id, name }
  publish_date: string;
  condition?: string;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";

export default function BooksList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  const q = searchParams.get("q") || "";
  const genreId = searchParams.get("genreId") || "";
  const condition = searchParams.get("condition") || "";
  const sortBy = (searchParams.get("sortBy") as "title" | "publish_date") || "title";
  const order = (searchParams.get("order") as "asc" | "desc") || "asc";
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "5");

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(searchParams);
    v ? next.set(k, v) : next.delete(k);
    if (k !== "page") next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  // === Load genres once (axios) ===
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/genre`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        const mapped: Genre[] = data.map((g: any) => ({
          id: String(g.id ?? g.genreId ?? ""),
          name: String(g.name ?? g.genreName ?? "-"),
        }));
        setGenres(mapped);
      } catch (e) {
        // fallback opsional
        setGenres([
          { id: "b34b1576-9613-4461-84e1-cbeea61df1db", name: "Technology" },
          { id: "11111111-1111-1111-1111-111111111111", name: "Fiction" },
          { id: "22222222-2222-2222-2222-222222222222", name: "History" },
        ]);
      }
    })();
  }, []);

  // === Load books when genreId changes (axios) ===
  const loadBooks = async () => {
    try {
      setLoading(true);
      setErr(null);

      const url = genreId ? `${API}/books/genre/${genreId}` : `${API}/books`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = Array.isArray(res.data) ? res.data : [];
      const mapped: Book[] = data.map((b: any) => ({
        id: Number(b.id),
        title: String(b.title ?? ""),
        writer: String(b.writer ?? ""),
        price: Number(b.price ?? 0),
        stock: Number(b.stock ?? b.stock_quantity ?? 0),
        genre: b.genre
          ? { id: String(b.genre.id ?? b.genreId ?? ""), name: String(b.genre.name ?? b.genreName ?? "-") }
          : { id: String(b.genreId ?? ""), name: String(b.genreName ?? "-") },
        publish_date: String(b.publish_date ?? b.publication_date ?? ""),
        condition: b.condition ?? "",
      }));

      setBooks(mapped);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreId]);

  // === FE filter/sort ===
  const filtered = useMemo(() => {
    let arr = [...books];
    if (q) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (b) => b.title.toLowerCase().includes(ql) || b.writer.toLowerCase().includes(ql)
      );
    }
    if (genreId) arr = arr.filter((b) => (b.genre?.id || "") === genreId);
    if (condition) arr = arr.filter((b) => (b.condition || "") === condition);

    arr.sort((a, b) => {
      const dir = order === "asc" ? 1 : -1;
      if (sortBy === "title") return a.title.localeCompare(b.title) * dir;
      return (
        (new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime()) *
        dir
      );
    });
    return arr;
  }, [books, q, genreId, condition, sortBy, order]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // === DELETE (axios) ===
  const onDelete = async (id: number) => {
    if (!confirm("Yakin hapus buku ini?")) return;
    try {
      await axios.delete(`${API}/books/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await loadBooks();
      alert("Buku dihapus");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Gagal hapus buku");
    }
  };

  return (
    <div className="container">
      <header className="toolbar">
        <h1 className="page-title">Books Management</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/books/add" className="btn btn-primary">+ Add Book</Link>
          <Link to="/transactions" className="btn btn-dark">Transactions</Link>
        </div>
      </header>

      <div className="grid filters card pad fade-in" style={{ marginBottom: 14 }}>
        <input
          className="input"
          placeholder="Search title or writer..."
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
        />

        <select
          className="select"
          value={genreId}
          onChange={(e) => setParam("genreId", e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select
          className="select"
          value={condition}
          onChange={(e) => setParam("condition", e.target.value)}
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>

        <select
          className="select"
          value={sortBy}
          onChange={(e) => setParam("sortBy", e.target.value)}
        >
          <option value="title">Title</option>
          <option value="publish_date">Publish Date</option>
        </select>
        <select
          className="select"
          value={order}
          onChange={(e) => setParam("order", e.target.value)}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {loading && <div className="card pad">Loading...</div>}
      {err && !loading && <div className="card pad">Error: {err}</div>}

      {!loading && !err && (
        <>
          <div className="table-wrap fade-in">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Writer</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Publish Date</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <Link to={`/books/${b.id}`} className="link">{b.title}</Link>
                    </td>
                    <td style={{ whiteSpace: "pre-line" }}>{b.writer}</td>
                    <td><span className="badge">{b.genre?.name}</span></td>
                    <td>{Intl.NumberFormat("id-ID").format(b.price)}</td>
                    <td>{b.stock}</td>
                    <td>{b.publish_date}</td>
                    <td style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <Link to={`/books/${b.id}/edit`} className="btn btn-outline" aria-label={`Edit ${b.title}`}>
                        Edit
                      </Link>
                      <button onClick={() => onDelete(b.id)} className="btn btn-danger" aria-label={`Delete ${b.title}`}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 16, textAlign: "center", color: "#64748b" }}>
                      No data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="pagination">
            <button
              className="btn btn-outline"
              disabled={page <= 1}
              onClick={() => setParam("page", String(page - 1))}
            >
              Prev
            </button>
            <span>Page {page}/{totalPages}</span>
            <button
              className="btn btn-outline"
              disabled={page >= totalPages}
              onClick={() => setParam("page", String(page + 1))}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

type Genre = { id: string; name: string };

type Book = {
  id: string;
  title: string;
  writer: string;
  price: number;
  stock_quantity: number;
  publication_year?: number | null;
  genre: Genre;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";

export default function BooksList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const q = searchParams.get("q") || "";
  const genreId = searchParams.get("genreId") || "";
  const sortBy = searchParams.get("sortBy") || "title";
  const order = searchParams.get("order") || "asc";
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "5");

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(searchParams);
    v ? next.set(k, v) : next.delete(k);
    if (k !== "page") next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  // Load Genres
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/genre`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setGenres(
          data.map((g: any) => ({
            id: String(g.id),
            name: String(g.name),
          }))
        );
      } catch {
        setGenres([]);
      }
    })();
  }, []);

  // Load Books via API Query Params
  const loadBooks = async () => {
    try {
      setLoading(true);
      setErr(null);

      const params: any = { page, limit: pageSize };
      if (q) params.search = q;
      if (sortBy === "title") params.orderByTitle = order;
      if (sortBy === "publish_date" || sortBy === "publication_year")
        params.orderByPublicationYear = order;

      const url = genreId ? `${API}/books/genre/${genreId}` : `${API}/books`;

      const res = await axios.get(url, {
        params,
        headers: { Authorization: `Bearer ${getToken()}` },
        withCredentials: true,
      });

      const apiData = res.data.data?.items ?? [];

      setBooks(
        apiData.map((b: any) => ({
          id: String(b.id),
          title: b.title,
          writer: b.writer,
          price: Number(b.price),
          stock_quantity: Number(b.stock_quantity ?? 0),
          publication_year: b.publication_year ?? null,
          genre: {
            id: String(b.genre?.id ?? b.genre_id),
            name: b.genre?.name ?? "-",
          },
        }))
      );

      setTotalPages(res.data.data?.pagination?.total_pages || 1);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [q, sortBy, order, page, pageSize, genreId]);

  const onDelete = async (id: string) => {
    if (!confirm("Yakin hapus buku ini?")) return;
    try {
      await axios.delete(`${API}/books/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        withCredentials: true,
      });
      await loadBooks();
      alert("Buku dihapus");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Gagal menghapus buku");
    }
  };

  return (
    <div className="container">
      <header className="toolbar">
        <h1 className="page-title">Books Management</h1>
        <div className="flex gap-3">
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

        <select className="select" value={genreId} onChange={(e) => setParam("genreId", e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select className="select" value={sortBy} onChange={(e) => setParam("sortBy", e.target.value)}>
          <option value="title">Title</option>
          <option value="publication_year">Publication Year</option>
        </select>

        <select className="select" value={order} onChange={(e) => setParam("order", e.target.value)}>
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
                  <th>Publication Year</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td><Link to={`/books/${b.id}`} className="link">{b.title}</Link></td>
                    <td>{b.writer}</td>
                    <td><span className="badge">{b.genre.name}</span></td>
                    <td>{Intl.NumberFormat("id-ID").format(b.price)}</td>
                    <td>{b.stock_quantity}</td>
                    <td>{b.publication_year ?? "-"}</td>
                    <td style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <Link to={`/books/${b.id}/edit`} className="btn btn-outline">Edit</Link>
                      <button onClick={() => onDelete(b.id)} className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-3 text-slate-500">No data.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="pagination">
            <button className="btn btn-outline" disabled={page <= 1} onClick={() => setParam("page", String(page - 1))}>Prev</button>
            <span>Page {page}/{totalPages}</span>
            <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => setParam("page", String(page + 1))}>Next</button>
          </nav>
        </>
      )}
    </div>
  );
}

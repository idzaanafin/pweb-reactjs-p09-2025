import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

// mock data
type Genre = { id: number; name: string };
type Book = {
  id: number;
  title: string;
  writer: string;
  price: number;
  stock: number;
  genre: Genre;
  publish_date: string;
  condition?: string;
};

const GENRES: Genre[] = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Technology" },
  { id: 3, name: "History" },
];

const MOCK_BOOKS: Book[] = [
  { id: 1,  title: "Clean Code",                writer: "Robert C. Martin",   price: 250000, stock: 12, genre: GENRES[1], publish_date: "2008-08-01", condition: "used" },
  { id: 2,  title: "Dune",                      writer: "Frank Herbert",      price: 180000, stock: 8,  genre: GENRES[0], publish_date: "1965-06-01", condition: "new" },
  { id: 3,  title: "Sapiens",                   writer: "Yuval N. Harari",    price: 220000, stock: 5,  genre: GENRES[2], publish_date: "2011-01-01", condition: "new" },
  { id: 4,  title: "The Pragmatic Programmer",  writer: "Andrew Hunt",        price: 270000, stock: 3,  genre: GENRES[1], publish_date: "1999-10-30", condition: "used" },
  { id: 5,  title: "Refactoring",               writer: "Martin Fowler",      price: 260000, stock: 7,  genre: GENRES[1], publish_date: "1999-07-08", condition: "used" },
  { id: 6,  title: "Design Patterns",           writer: "Erich Gamma",        price: 300000, stock: 4,  genre: GENRES[1], publish_date: "1994-10-31", condition: "used" },
  { id: 7,  title: "Atomic Habits",             writer: "James Clear",        price: 175000, stock: 15, genre: GENRES[2], publish_date: "2018-10-16", condition: "new" },
  { id: 8,  title: "Deep Work",                 writer: "Cal Newport",        price: 165000, stock: 10, genre: GENRES[2], publish_date: "2016-01-05", condition: "new" },
  { id: 9,  title: "Foundation",                writer: "Isaac Asimov",       price: 150000, stock: 9,  genre: GENRES[0], publish_date: "1951-06-01", condition: "used" },
  { id:10,  title: "Neuromancer",               writer: "William Gibson",     price: 155000, stock: 6,  genre: GENRES[0], publish_date: "1984-07-01", condition: "used" },
  { id:11,  title: "Algorithms",                writer: "Sedgewick & Wayne",  price: 320000, stock: 5,  genre: GENRES[1], publish_date: "2011-04-01", condition: "new" },
  { id:12,  title: "Introduction to Algorithms",writer: "Cormen et al.",      price: 350000, stock: 2,  genre: GENRES[1], publish_date: "2009-07-31", condition: "used" },
  { id:13,  title: "Homo Deus",                 writer: "Yuval N. Harari",    price: 230000, stock: 6,  genre: GENRES[2], publish_date: "2015-09-08", condition: "new" },
  { id:14,  title: "Brave New World",           writer: "Aldous Huxley",      price: 140000, stock: 11, genre: GENRES[0], publish_date: "1932-08-31", condition: "used" },
  { id:15,  title: "Clean Architecture",        writer: "Robert C. Martin",   price: 280000, stock: 5,  genre: GENRES[1], publish_date: "2017-09-20", condition: "new" },
];

export default function BooksList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [genres] = useState<Genre[]>(GENRES);

  const q = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const condition = searchParams.get("condition") || "";
  const sortBy = (searchParams.get("sortBy") as "title" | "publish_date") || "title";
  const order = (searchParams.get("order") as "asc" | "desc") || "asc";
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "5");

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(searchParams);
    if (v) next.set(k, v); else next.delete(k);
    if (k !== "page") next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let arr = [...books];
    if (q) arr = arr.filter(b =>
      b.title.toLowerCase().includes(q.toLowerCase()) ||
      b.writer.toLowerCase().includes(q.toLowerCase())
    );
    if (genre) arr = arr.filter(b => b.genre.name === genre);
    if (condition) arr = arr.filter(b => b.condition === condition);
    arr.sort((a, b) => {
      const dir = order === "asc" ? 1 : -1;
      if (sortBy === "title") return a.title.localeCompare(b.title) * dir;
      return (new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime()) * dir;
    });
    return arr;
  }, [books, q, genre, condition, sortBy, order]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onDelete = (id: number) => {
    if (confirm("Yakin hapus buku ini?")) {
      setBooks(prev => prev.filter(b => b.id !== id));
      alert("Buku dihapus (mock)");
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

      {/* Filter bar */}
      <div className="grid filters card pad fade-in" style={{ marginBottom: 14 }}>
        <input
          className="input"
          placeholder="Search title or writer..."
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
        />
        <select className="select" value={genre} onChange={(e) => setParam("genre", e.target.value)}>
          <option value="">All Genres</option>
          {genres.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
        </select>
        <select className="select" value={condition} onChange={(e) => setParam("condition", e.target.value)}>
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        <select className="select" value={sortBy} onChange={(e) => setParam("sortBy", e.target.value)}>
          <option value="title">Title</option>
          <option value="publish_date">Publish Date</option>
        </select>
        <select className="select" value={order} onChange={(e) => setParam("order", e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* Table */}
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
            {paginated.map(b => (
              <tr key={b.id}>
                <td><Link to={`/books/${b.id}`} className="link">{b.title}</Link></td>
                <td style={{ whiteSpace: "pre-line" }}>{b.writer}</td>
                <td><span className="badge">{b.genre.name}</span></td>
                <td>{Intl.NumberFormat("id-ID").format(b.price)}</td>
                <td>{b.stock}</td>
                <td>{b.publish_date}</td>
                <td style={{ textAlign: "right" }}>
                  <button onClick={() => onDelete(b.id)} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav className="pagination">
        <button className="btn btn-outline" disabled={page <= 1} onClick={() => setParam("page", String(page - 1))}>Prev</button>
        <span>Page {page}/{totalPages}</span>
        <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => setParam("page", String(page + 1))}>Next</button>
      </nav>
    </div>
  );
}

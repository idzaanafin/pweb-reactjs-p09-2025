import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

type Transaction = {
  id: string;
  created_at: string;
  totalAmount: number;
  user: { username: string };
  order_items: Array<{
    book_id: string;
    quantity: number;
    book: { title: string; price: number };
  }>;
};

export default function TransactionList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "totalAmount" | "price">("id");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    let cancelled = false;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: perPage,
          search: query,
          orderById: "asc",
        };
        const res = await axios.get(`${API}/transactions`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) {
          setItems(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Gagal memuat transaksi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      cancelled = true;
    };
  }, [page, perPage, query, navigate]);

  const sortItems = (list: Transaction[]) => {
    return [...list].sort((a, b) => {
      if (sortBy === "id") return a.id.localeCompare(b.id);
      if (sortBy === "totalAmount") return a.totalAmount - b.totalAmount;
      if (sortBy === "price") {
        const avgA =
          a.order_items.length > 0
            ? a.order_items.reduce(
                (sum, item) => sum + (Number(item.book?.price) || 0),
                0
              ) / a.order_items.length
            : 0;
        const avgB =
          b.order_items.length > 0
            ? b.order_items.reduce(
                (sum, item) => sum + (Number(item.book?.price) || 0),
                0
              ) / b.order_items.length
            : 0;
        return avgA - avgB;
      }
      return 0;
    });
  };

  const filteredItems = items.filter((t) =>
    t.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container">
      <header className="toolbar">
        <h1 className="page-title">Transactions</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link to="/books" className="btn btn-dark">Books</Link>
          <Link to="/transactions/checkout" className="btn btn-primary">Checkout</Link>
        </div>
      </header>

      <div className="grid filters card pad fade-in" style={{ marginBottom: 14 }}>
        <input
          className="input"
          placeholder="Search transaction ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "id" | "totalAmount" | "price")}
        >
          <option value="id">Sort by ID</option>
          <option value="totalAmount">Sort by Total Amount</option>
          <option value="price">Sort by Book Price</option>
        </select>
      </div>

      {loading && <div className="card pad">Loading...</div>}
      {error && !loading && <div className="card pad">Error: {error}</div>}

      {!loading && !error && (
        <>
          <div className="table-wrap fade-in" style={{ overflowX: "auto" }}>
            <table className="table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Buyer</th>
                  <th>Date</th>
                  <th>Avg Book Price</th>
                  <th>Total Amount</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortItems(filteredItems).map((t) => {
                  const totalHarga = t.order_items.reduce(
                    (sum, i) => sum + (Number(i.book?.price) || 0),
                    0
                  );
                  const avgPrice =
                    t.order_items.length > 0 ? totalHarga / t.order_items.length : 0;

                  return (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.user.username}</td>
                      <td>{new Date(t.created_at).toLocaleString()}</td>
                      <td>{formatRupiah(avgPrice)}</td>
                      <td>{formatRupiah(t.totalAmount || 0)}</td>
                      <td style={{ textAlign: "right" }}>
                        <Link to={`/transactions/${t.id}`} className="btn btn-outline">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-slate-500 py-4">
                      No transactions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="pagination mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              className="btn btn-outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              className="btn btn-outline"
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
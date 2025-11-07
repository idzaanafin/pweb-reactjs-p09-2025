import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";

type TransactionDetailType = {
  id: string;
  created_at: string;
  totalAmount?: number;
  user: { username: string };
  order_items: Array<{
    book_id: string;
    quantity: number;
    book: { title: string; price: number };
  }>;
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionDetailType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    let cancelled = false;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled) setTransaction(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat detail transaksi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (loading) return <div className="card pad">Loading...</div>;
  if (error) return <div className="card pad text-red-600">{error}</div>;
  if (!transaction) return <div className="card pad">Tidak ada data transaksi.</div>;

  const totalHarga = transaction.order_items.reduce(
    (sum, it) => sum + (Number(it.book.price) || 0) * (Number(it.quantity) || 0),
    0
  );

  return (
    <div className="container">
      <header className="toolbar">
        <h1 className="page-title">Transaction Detail</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/transactions" className="btn btn-outline">← Back to List</Link>
        </div>
      </header>

      <div className="card pad fade-in">
        <p><strong>ID Transaksi:</strong> {transaction.id}</p>
        <p><strong>Nama Pembeli:</strong> {transaction.user.username}</p>
        <p><strong>Tanggal:</strong> {new Date(transaction.created_at).toLocaleString()}</p>

        {transaction.order_items.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Items</h3>
            <div className="table-wrap" style={{ overflowX: "auto" }}>
              <table className="table" style={{ minWidth: 600 }}>
                <thead>
                  <tr>
                    <th>Book ID</th>
                    <th>Title</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.order_items.map((it, idx) => {
                    const subtotal =
                      (Number(it.book.price) || 0) * (Number(it.quantity) || 0);
                    return (
                      <tr key={idx}>
                        <td>{it.book_id}</td>
                        <td>{it.book.title}</td>
                        <td>{it.quantity}</td>
                        <td>{formatRupiah(Number(it.book.price) || 0)}</td>
                        <td>{formatRupiah(subtotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-4 font-semibold text-lg">
              Total: {formatRupiah(totalHarga)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
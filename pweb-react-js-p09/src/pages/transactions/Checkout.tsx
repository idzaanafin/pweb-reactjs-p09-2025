import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const getToken = () => localStorage.getItem("token") || "";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

type Book = {
  id: string;
  title: string;
  price: number;
  stock_quantity: number;
};

export default function Checkout() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();

  // Fetch daftar buku
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/books`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res.data?.data?.items || [];
        if (!Array.isArray(items)) throw new Error("Format data tidak valid");
        setBooks(items);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat daftar buku.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [token, navigate]);

  const handleQuantityChange = (id: string, quantity: number) => {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, quantity) }));
  };

  const subtotal = books.reduce((sum, book) => {
    const qty = cart[book.id] || 0;
    return sum + book.price * qty;
  }, 0);

  // === HANDLE CHECKOUT ===
  const handleCheckout = async () => {
  if (subtotal <= 0) {
    alert("Pilih minimal 1 buku sebelum checkout!");
    return;
  }

  try {
    setLoading(true);
    const user_id = localStorage.getItem("user_id");
    console.log("🧍 user_id:", user_id); // tambahkan log ini

    const items = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([book_id, quantity]) => ({
        book_id,
        quantity,
      }));

    console.log("📦 Data dikirim ke backend:", { user_id, items });

    const res = await axios.post(
      `${API}/transactions`,
      { user_id, items },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Transaksi berhasil dibuat!");
    navigate(`/transactions/${res.data.data.order.id}`);
  } catch (err: any) {
    console.error("Checkout error:", err.response?.data || err.message);
    alert(
      `Gagal membuat transaksi: ${
        err.response?.data?.message || "Terjadi kesalahan."
      }`
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container">
      <header className="toolbar">
        <h1 className="page-title">Checkout Buku</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/transactions" className="btn btn-outline">
            ← Back to Transactions
          </Link>
        </div>
      </header>

      {loading && <div className="card pad">Memuat...</div>}
      {error && !loading && (
        <div className="card pad text-red-600">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="table-wrap fade-in" style={{ overflowX: "auto" }}>
            <table className="table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => {
                  const qty = cart[b.id] || 0;
                  const sub = b.price * qty;
                  return (
                    <tr key={b.id}>
                      <td>{b.title}</td>
                      <td>{formatRupiah(b.price)}</td>
                      <td className="text-center">{b.stock_quantity}</td>
                      <td className="text-center">
                        <input
                          type="number"
                          min="0"
                          max={b.stock_quantity}
                          value={qty}
                          onChange={(e) =>
                            handleQuantityChange(b.id, Number(e.target.value))
                          }
                          className="input w-20 text-center"
                        />
                      </td>
                      <td>{formatRupiah(isNaN(sub) ? 0 : sub)}</td>
                    </tr>
                  );
                })}
                {books.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-500 py-4">
                      Tidak ada buku tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card pad mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold">
              Total: {formatRupiah(isNaN(subtotal) ? 0 : subtotal)}
            </h2>
            <button
              onClick={handleCheckout}
              disabled={subtotal <= 0 || loading}
              className="btn btn-primary disabled:bg-gray-400"
            >
              {loading ? "Memproses..." : "Buat Transaksi"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

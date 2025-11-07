import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container fade-in">
      {/* Hero */}
      <section className="card pad" style={{ padding: 24, display: "grid", gap: 14 }}>
        <h1 className="page-title" style={{ margin: 0 }}>IT Literature Shop</h1>
        <p style={{ color: "var(--text-700)", maxWidth: 720, lineHeight: 1.6 }}>
          Kelola koleksi buku kampus dengan mudah. Cari, filter, urutkan, dan pantau transaksi —
          semua dalam satu dashboard yang simple & responsif.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/books" className="btn btn-primary">📚 Kelola Buku</Link>
          <Link to="/transactions" className="btn btn-dark">💳 Lihat Transaksi</Link>
          <Link to="/books/add" className="btn btn-outline">➕ Tambah Buku</Link>
        </div>
      </section>

      {/* 3 Kolom fitur ringkas */}
      <section className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="card pad">
          <h3 style={{ margin: 0, fontWeight: 700 }}>Search & Filter</h3>
          <p style={{ color: "var(--muted)" }}>Cari judul/penulis, filter genre & kondisi, dan urutkan berdasarkan judul atau tanggal terbit.</p>
        </div>
        <div className="card pad">
          <h3 style={{ margin: 0, fontWeight: 700 }}>Detail Lengkap</h3>
          <p style={{ color: "var(--muted)" }}>Lihat detail buku: publisher, ISBN, stok, harga, hingga deskripsi.</p>
        </div>
        <div className="card pad">
          <h3 style={{ margin: 0, fontWeight: 700 }}>Transaksi</h3>
          <p style={{ color: "var(--muted)" }}>Pantau transaksi & histori untuk laporan cepat.</p>
        </div>
      </section>

      {/* Stats dummy (opsional, biar ‘hidup’) */}
      <section className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="card pad">
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Total Buku</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>—</div>
        </div>
        <div className="card pad">
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Genre</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>—</div>
        </div>
        <div className="card pad">
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Stok Tersedia</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>—</div>
        </div>
        <div className="card pad">
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Transaksi Bulan Ini</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>—</div>
        </div>
      </section>

    </div>
  );
}

import { Link, useParams } from "react-router-dom";

type BookDetail = {
  id: number;
  title: string;
  writer: string;
  publisher: string;
  price: number;
  stock: number;
  genreName: string;
  isbn?: string;
  description?: string;
  publication_year?: number;
  condition?: "new" | "used";
  publish_date?: string;
};

/** Detail lengkap untuk 15 buku (mock) */
const BOOK_DETAILS: BookDetail[] = [
  {
    id: 1,
    title: "Clean Code",
    writer: "Robert C. Martin",
    publisher: "Prentice Hall",
    price: 250000,
    stock: 12,
    genreName: "Technology",
    isbn: "9780132350884",
    description: "A handbook of agile software craftsmanship yang membahas praktik menulis kode yang bersih dan mudah dirawat.",
    publication_year: 2008,
    condition: "used",
    publish_date: "2008-08-01",
  },
  {
    id: 2,
    title: "Dune",
    writer: "Frank Herbert",
    publisher: "Chilton Books",
    price: 180000,
    stock: 8,
    genreName: "Fiction",
    isbn: "9780441013593",
    description: "Epik fiksi ilmiah tentang politik, ekologi, dan masa depan di planet gurun Arrakis.",
    publication_year: 1965,
    condition: "new",
    publish_date: "1965-06-01",
  },
  {
    id: 3,
    title: "Sapiens",
    writer: "Yuval N. Harari",
    publisher: "Harvill Secker",
    price: 220000,
    stock: 5,
    genreName: "History",
    isbn: "9780062316097",
    description: "Ringkasan sejarah umat manusia dari era pemburu-peramu hingga revolusi ilmu pengetahuan.",
    publication_year: 2011,
    condition: "new",
    publish_date: "2011-01-01",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    writer: "Andrew Hunt",
    publisher: "Addison-Wesley",
    price: 270000,
    stock: 3,
    genreName: "Technology",
    isbn: "9780201616224",
    description: "Kumpulan prinsip dan tips praktis untuk menjadi programmer yang efektif dan pragmatis.",
    publication_year: 1999,
    condition: "used",
    publish_date: "1999-10-30",
  },
  {
    id: 5,
    title: "Refactoring",
    writer: "Martin Fowler",
    publisher: "Addison-Wesley",
    price: 260000,
    stock: 7,
    genreName: "Technology",
    isbn: "9780201485677",
    description: "Teknik meningkatkan desain kode yang sudah ada tanpa mengubah perilaku eksternalnya.",
    publication_year: 1999,
    condition: "used",
    publish_date: "1999-07-08",
  },
  {
    id: 6,
    title: "Design Patterns",
    writer: "Erich Gamma",
    publisher: "Addison-Wesley",
    price: 300000,
    stock: 4,
    genreName: "Technology",
    isbn: "9780201633610",
    description: "Katalog pola desain berorientasi objek untuk solusi masalah rekayasa perangkat lunak yang berulang.",
    publication_year: 1994,
    condition: "used",
    publish_date: "1994-10-31",
  },
  {
    id: 7,
    title: "Atomic Habits",
    writer: "James Clear",
    publisher: "Avery",
    price: 175000,
    stock: 15,
    genreName: "History",
    isbn: "9780735211292",
    description: "Bagaimana perubahan kecil menghasilkan hasil luar biasa melalui sistem kebiasaan.",
    publication_year: 2018,
    condition: "new",
    publish_date: "2018-10-16",
  },
  {
    id: 8,
    title: "Deep Work",
    writer: "Cal Newport",
    publisher: "Grand Central Publishing",
    price: 165000,
    stock: 10,
    genreName: "History",
    isbn: "9781455586691",
    description: "Strategi bekerja fokus tanpa distraksi untuk menghasilkan output bernilai tinggi.",
    publication_year: 2016,
    condition: "new",
    publish_date: "2016-01-05",
  },
  {
    id: 9,
    title: "Foundation",
    writer: "Isaac Asimov",
    publisher: "Gnome Press",
    price: 150000,
    stock: 9,
    genreName: "Fiction",
    isbn: "9780553293357",
    description: "Sebuah saga tentang upaya menyelamatkan pengetahuan untuk menghadapi kemunduran peradaban galaksi.",
    publication_year: 1951,
    condition: "used",
    publish_date: "1951-06-01",
  },
  {
    id: 10,
    title: "Neuromancer",
    writer: "William Gibson",
    publisher: "Ace",
    price: 155000,
    stock: 6,
    genreName: "Fiction",
    isbn: "9780441569595",
    description: "Cyberpunk klasik yang memperkenalkan dunia matrix dan konsol cowboys.",
    publication_year: 1984,
    condition: "used",
    publish_date: "1984-07-01",
  },
  {
    id: 11,
    title: "Algorithms",
    writer: "Sedgewick & Wayne",
    publisher: "Addison-Wesley",
    price: 320000,
    stock: 5,
    genreName: "Technology",
    isbn: "9780321573513",
    description: "Pembahasan struktur data dan algoritma modern dengan pendekatan praktis.",
    publication_year: 2011,
    condition: "new",
    publish_date: "2011-04-01",
  },
  {
    id: 12,
    title: "Introduction to Algorithms",
    writer: "Cormen et al.",
    publisher: "MIT Press",
    price: 350000,
    stock: 2,
    genreName: "Technology",
    isbn: "9780262033848",
    description: "Referensi komprehensif algoritma (CLRS) dengan analisis formal dan pseudocode.",
    publication_year: 2009,
    condition: "used",
    publish_date: "2009-07-31",
  },
  {
    id: 13,
    title: "Homo Deus",
    writer: "Yuval N. Harari",
    publisher: "Harvill Secker",
    price: 230000,
    stock: 6,
    genreName: "History",
    isbn: "9780062464316",
    description: "Eksplorasi masa depan manusia: AI, bioteknologi, dan tantangan etika.",
    publication_year: 2015,
    condition: "new",
    publish_date: "2015-09-08",
  },
  {
    id: 14,
    title: "Brave New World",
    writer: "Aldous Huxley",
    publisher: "Chatto & Windus",
    price: 140000,
    stock: 11,
    genreName: "Fiction",
    isbn: "9780060850524",
    description: "Dystopia klasik tentang kontrol sosial, rekayasa genetika, dan hedonisme terstruktur.",
    publication_year: 1932,
    condition: "used",
    publish_date: "1932-08-31",
  },
  {
    id: 15,
    title: "Clean Architecture",
    writer: "Robert C. Martin",
    publisher: "Prentice Hall",
    price: 280000,
    stock: 5,
    genreName: "Technology",
    isbn: "9780134494166",
    description: "Prinsip arsitektur perangkat lunak agar sistem mudah diuji, dikembangkan, dan dirawat.",
    publication_year: 2017,
    condition: "new",
    publish_date: "2017-09-20",
  },
];

export default function BookDetail() {
  const { id } = useParams();
  const book = BOOK_DETAILS.find((b) => b.id === Number(id));

  if (!book) {
    return (
      <div className="container">
        <header className="toolbar">
          <h1 className="page-title">Book Detail</h1>
          <Link to="/books" className="btn btn-outline">← Back</Link>
        </header>
        <div className="card pad" style={{ marginTop: 12 }}>
          Book not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <header className="toolbar">
        <h1 className="page-title">{book.title}</h1>
        <Link to="/books" className="btn btn-outline">← Back</Link>
      </header>

      <div className="card pad" style={{ display: "grid", gap: 20 }}>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Info label="Writer" value={book.writer} />
          <Info label="Publisher" value={book.publisher} />
          <Info label="Genre" value={book.genreName} />
          <Info label="ISBN" value={book.isbn || "-"} />
          <Info label="Publication Year" value={book.publication_year ? String(book.publication_year) : "-"} />
          <Info label="Condition" value={book.condition || "-"} />
          <Info label="Price" value={`Rp ${Intl.NumberFormat("id-ID").format(book.price)}`} />
          <Info label="Stock" value={String(book.stock)} />
          <Info label="Publish Date" value={book.publish_date || "-"} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="textarea" style={{ background: "#fff", resize: "none" }}>
            {book.description || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="card"
      style={{
        padding: "12px 14px",
        display: "grid",
        gap: 4,
        background: "rgba(255,255,255,0.9)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div className="text-sm" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="font-medium" style={{ color: "var(--text-900)" }}>
        {value || "-"}
      </div>
    </div>
  );
}

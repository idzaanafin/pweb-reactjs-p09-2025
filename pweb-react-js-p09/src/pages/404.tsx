export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-4 text-xl">Halaman tidak ditemukan.</p>
      <a href="/" className="mt-6 text-blue-600 underline">Kembali ke Beranda</a>
    </div>
  );
}

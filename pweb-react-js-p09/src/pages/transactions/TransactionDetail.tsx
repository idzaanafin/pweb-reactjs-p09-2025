import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TransactionDetail() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    fetch(`/api/transactions/${id}`)
      .then(res => res.json())
      .then(data => setTransaction(data));
  }, [id]);

  if (!transaction) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Detail Transaksi</h1>
      <div className="bg-white border rounded p-4 shadow">
        <p><strong>ID Transaksi:</strong> {transaction.id}</p>
        <p><strong>Nama Pembeli:</strong> {transaction.customer}</p>
        <p><strong>Total:</strong> Rp{transaction.total}</p>
        <p><strong>Tanggal:</strong> {transaction.date}</p>
      </div>
    </div>
  );
}

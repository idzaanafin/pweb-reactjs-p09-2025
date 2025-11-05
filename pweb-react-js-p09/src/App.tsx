import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Books from "./pages/books/Book";
import Transactions from "./pages/transactions/Transaction";
import MainLayout from "./layouts/MainLayout";
import BookDetail from "./pages/books/BookDetail";
import TransactionDetail from "./pages/transactions/TransactionDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        {/* Books */}
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />

        {/* Transactions */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:id" element={<TransactionDetail />} />
      </Route>
    </Routes>
  );
}


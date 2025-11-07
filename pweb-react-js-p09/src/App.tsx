import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Books from "./pages/books/Book";
import Transactions from "./pages/transactions/TransactionList";
import TransactionDetail from "./pages/transactions/TransactionDetail";
import Checkout from "./pages/transactions/Checkout";
import MainLayout from "./layouts/MainLayout";
import BookDetail from "./pages/books/BookDetail";
import AddBook from "./pages/books/addBook";
import EditBook from "./pages/books/editBook";
import Home from "./pages/home";
import NotFound from "./pages/404";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirect>
            <Register />
          </AuthRedirect>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="books/:id/edit" element={<EditBook />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/checkout" element={<Checkout />} />
        <Route path="transactions/:id" element={<TransactionDetail />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

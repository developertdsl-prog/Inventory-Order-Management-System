import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductFormPage } from "./pages/ProductFormPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { useEffect, useState } from "react";

function PrivateRoute({ children }: { children: any }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  if (!isAuthenticated) return <nav>Loading...</nav>;

  return children;
}

function PublicRoute({ children }: { children: any }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  if (isAuthenticated) return <nav><Link to="/dashboard">Go to dashboard</Link></nav>;

  return children;
}

export const App = () => {
  return (
    <Router>
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-white font-bold text-xl mr-6">
            IOMS
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard" className="text-white hover:opacity-80">Dashboard</Link>
            <Link to="/products" className="text-white hover:opacity-80">Products</Link>
            <Link to="/categories" className="text-white hover:opacity-80">Categories</Link>
          </div>
        </div>
      </nav>

      <div className="p-8">
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <PrivateRoute>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </PrivateRoute>
        </Routes>
      </div>
    </Router>
  );
};

import { Navigate } from "react-router-dom";
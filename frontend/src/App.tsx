import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "./store/selectors";
import { logout } from "./store/authSlice";

function PrivateRoute({ children }: { children: any }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: user } = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) return <nav>Loading...</nav>;

  return children;
}

function PublicRoute({ children }: { children: any }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  if (isAuthenticated) return <nav><a href="/dashboard">Go to dashboard</a></nav>;

  return children;
}

export const App = () => {
  return (
    <Router>
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/login" className="text-white font-bold mr-4">
            IOMS
          </Link>
          <div className="hidden md:block">
            <Link to="/dashboard" className="mr-4 text-white">Dashboard</Link>
            <Link to="/products" className="text-white">Products</Link>
          </div>
          <button className="md:hidden text-white px-4 py-2 rounded">Menu</button>
        </div>
      </nav>

      <div className="p-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <PrivateRoute>
            <Route path="/dashboard" element={<DashboardPage />} />
          </PrivateRoute>
          <Route path="/products" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
};
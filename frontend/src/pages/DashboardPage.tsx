import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../store/selectors";
import { logout } from "../store/authSlice";
import { axiosInstance } from "../api/apiClient";
import { Chart as ChartJS } from "chart.js";
import { Bar } from "react-chartjs-2";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  netStock: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // Get current user
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (!user) {
      dispatch(logout);
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/dashboard/summary");
        setStats(response.data);
      } catch (error: any) {
        console.error("Dashboard data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Refresh on user change
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user, dispatch]);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          {isLoading ? (
            <p>Loading dashboard data...</p>
          ) : (
            <p>Please log in to view the dashboard.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-white font-bold">IOMS Dashboard</span>
          <div className="hidden md:block">
            <span className="text-white mr-4">Welcome, {user?.email}</span>
            <button
              onClick={() => dispatch(logout)}
              className="text-white px-4 py-2 rounded hoveropacity-80"
            >
              Logout
            </button>
          </div>
          <button className="md:hidden text-white px-4 py-2 rounded">Menu</button>
        </div>
      </nav>

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Total Products Card -->
          <div className="bg-white p-6 rounded-lg shadow-sm hover:transition-shadow hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                  <path d="M3 8v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM3 14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.totalProducts}</p>
              </div>
            </div>
          </div>

          <!-- Total Orders Card -->
          <div className="bg-white p-6 rounded-lg shadow-sm hover:transition-shadow hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24">
                  <path d="M13 2H6a2 2 0 0 0-2 2v3h2V5h8v3h2V5h8l1.224 5.35a2 2 0 0 0 2.576-.98l1.36-5.06A2 2 0 0 0 21 7.5v-8a2 2 0 0 0-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-green-600">{stats?.totalOrders}</p>
              </div>
            </div>
          </div>

          <!-- Net Stock Card -->
          <div className="bg-white p-6 rounded-lg shadow-sm hover:transition-shadow hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-orange-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-orange-600" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-8-8 8 8 8v2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Net Stock</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.netStock > 0 ? '+' : ''}{stats?.netStock}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders Section -->
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          {stats?.recentOrders.length === 0 ? (
            <p>No recent orders</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentOrders.map((order: any) => (
                <li key={order.id} className="text-sm">
                  Order {order.id}: {order.quantity} items - {order.createdAt}
                </li>
              ))}
            </ul>
          )}
        </div>

        <!-- Low Stock Section -->
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-4">Low Stock Alerts</h3>
          {stats?.lowStockProducts.length === 0 ? (
            <p>All products are well-stocked</p>
          ) : (
            <ul className="space-y-2">
              {stats.lowStockProducts.map((product: any) => (
                <li key={product.id} className="text-red-600 text-sm">
                  {product.name}: {product.stock} in stock
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
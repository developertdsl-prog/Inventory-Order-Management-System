import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const SalesOrdersPage = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");

  useEffect(() => {
    loadData();
  }, [statusFilter, customerFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [soRes, custRes] = await Promise.all([
        axiosInstance.get("/sales-orders", {
          params: {
            status: statusFilter || undefined,
            customerId: customerFilter || undefined,
          },
        }),
        axiosInstance.get("/customers"),
      ]);
      setSalesOrders(soRes.data.salesOrders);
      setCustomers(custRes.data);
    } catch (err) {
      console.error("Error loading sales orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-blue-600 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-white font-bold text-xl mr-4">
              ← Back to Dashboard
            </Link>
          </div>
          <button
            onClick={() => window.location.href = "/sales-orders/new"}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + New Sales Order
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Customers</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading sales orders...</div>
        ) : salesOrders.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-lg">No sales orders found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Order Number</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Customer</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Total Amount</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Created</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesOrders.map((so: any) => (
                  <tr key={so.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{so.id}</td>
                    <td className="p-4">{so.customer?.name || "Unknown"}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          so.status === "PENDING" ? "bg-yellow-100 text-yellow-600" :
                          so.status === "CONFIRMED" ? "bg-blue-100 text-blue-600" :
                          so.status === "SHIPPED" ? "bg-indigo-100 text-indigo-600" :
                          so.status === "DELIVERED" ? "bg-green-100 text-green-600" :
                          "bg-red-100 text-red-600"
                        }`}
                      >
                        {so.status}
                      </span>
                    </td>
                    <td className="p-4">${so.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">{new Date(so.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link
                        to={`/sales-orders/${so.id}`}
                        className="text-blue-600 hover underline text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
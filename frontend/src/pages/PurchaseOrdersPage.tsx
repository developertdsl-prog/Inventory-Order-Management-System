import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");

  useEffect(() => {
    loadData();
  }, [statusFilter, supplierFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [poRes, suppRes] = await Promise.all([
        axiosInstance.get("/purchase-orders", {
          params: {
            status: statusFilter || undefined,
            supplierId: supplierFilter || undefined,
          },
        }),
        axiosInstance.get("/suppliers"),
      ]);
      setPurchaseOrders(poRes.data.purchaseOrders);
      setSuppliers(suppRes.data);
    } catch (err) {
      console.error("Error loading purchase orders:", err);
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
            onClick={() => window.location.href = "/purchase-orders/new"}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + New Purchase Order
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
              <option value="APPROVED">Approved</option>
              <option value="RECEIVED">Received</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Suppliers</option>
              {suppliers.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading purchase orders...</div>
        ) : purchaseOrders.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-lg">No purchase orders found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">PO Number</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Supplier</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Total Amount</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Created</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po: any) => (
                  <tr key={po.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{po.id}</td>
                    <td className="p-4">{po.supplier?.name || "Unknown"}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          po.status === "PENDING" ? "bg-yellow-100 text-yellow-600" :
                          po.status === "APPROVED" ? "bg-blue-100 text-blue-600" :
                          po.status === "RECEIVED" ? "bg-green-100 text-green-600" :
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4">${po.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">{new Date(po.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link
                        to={`/purchase-orders/${po.id}`}
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
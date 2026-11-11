import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const SalesOrderDetailPage = () => {
  const { id } = useParams();
  const [salesOrder, setSalesOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalesOrder();
  }, [id]);

  const loadSalesOrder = async () => {
    try {
      const response = await axiosInstance.get(`/sales-orders/${id}`);
      setSalesOrder(response.data);
    } catch (err) {
      console.error("Error loading sales order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!confirm("Confirm this sales order? This will deduct stock from products.")) return;
    try {
      await axiosInstance.put(`/sales-orders/${id}/status`, { status: "CONFIRMED" });
      loadSalesOrder();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to confirm order");
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Cancel this sales order?")) return;
    try {
      await axiosInstance.post(`/sales-orders/${id}/cancel`);
      loadSalesOrder();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to cancel order");
    }
  };

  if (!salesOrder) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Sales Order Details</h2>
          {loading ? <p>Loading...</p> : <p>Sales order not found</p>}
          <Link
            to="/sales-orders"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Sales Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-600",
    CONFIRMED: "bg-blue-100 text-blue-600",
    SHIPPED: "bg-indigo-100 text-indigo-600",
    DELIVERED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-4xl mx-auto">
      <nav className="mb-6">
        <Link to="/sales-orders" className="text-blue-600 hover underline">
          ← Back to Sales Orders
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Sales Order</h1>
            <p className="text-gray-500">Customer: {salesOrder.customer?.name}</p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${statusColors[salesOrder.status] || "bg-gray-100 text-gray-600"}`}
            >
              {salesOrder.status}
            </span>
            {salesOrder.status === "PENDING" && (
              <button
                onClick={handleConfirmOrder}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm Order
              </button>
            )}
            {salesOrder.status !== "DELIVERED" && salesOrder.status !== "CANCELLED" && (
              <button
                onClick={handleCancelOrder}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-bold">{salesOrder.id}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-bold">${salesOrder.totalAmount?.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-bold">{new Date(salesOrder.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Items</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Product</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">SKU</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Quantity</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Unit Price</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {salesOrder.items.map((item: any) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{item.product?.name}</td>
                  <td className="p-4">{item.product?.sku}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">${item.unitPrice?.toFixed(2)}</td>
                  <td className="p-4 font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer Info */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Customer Details</h3>
          <p className="text-gray-700 mb-1">{salesOrder.customer?.name}</p>
          <p className="text-gray-700 mb-1">{salesOrder.customer?.email}</p>
          <p className="text-gray-700 mb-1">{salesOrder.customer?.phone || "Not provided"}</p>
          <p className="text-gray-700">{salesOrder.customer?.address || "Not provided"}</p>
        </div>
      </div>
    </div>
  );
};
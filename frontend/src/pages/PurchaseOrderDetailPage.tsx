import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const PurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseOrder();
  }, [id]);

  const loadPurchaseOrder = async () => {
    try {
      const response = await axiosInstance.get(`/purchase-orders/${id}`);
      setPurchaseOrder(response.data);
    } catch (err) {
      console.error("Error loading purchase order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveGoods = async () => {
    if (!confirm("Confirm receiving all goods for this purchase order?")) return;
    try {
      await axiosInstance.post(`/purchase-orders/${id}/receive`);
      setLoading(true);
      loadPurchaseOrder();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to receive goods");
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await axiosInstance.put(`/purchase-orders/${id}/status`, { status });
      loadPurchaseOrder();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  if (!purchaseOrder) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Purchase Order Details</h2>
          {loading ? <p>Loading...</p> : <p>Purchase order not found</p>}
          <Link
            to="/purchase-orders"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Purchase Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-600",
    APPROVED: "bg-blue-100 text-blue-600",
    RECEIVED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-4xl mx-auto">
      <nav className="mb-6">
        <Link to="/purchase-orders" className="text-blue-600 hover underline">
          ← Back to Purchase Orders
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Purchase Order</h1>
            <p className="text-gray-500">Supplier: {purchaseOrder.supplier?.name}</p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${statusColors[purchaseOrder.status] || "bg-gray-100 text-gray-600"}`}
            >
              {purchaseOrder.status}
            </span>
            {!purchaseOrder.received && (
              <button
                onClick={handleReceiveGoods}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={purchaseOrder.status !== "APPROVED"}
              >
                Receive Goods
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">PO Number</p>
            <p className="font-bold">{purchaseOrder.id}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-bold">${purchaseOrder.totalAmount?.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Created</p>
            <p className="font-bold">{new Date(purchaseOrder.createdAt).toLocaleDateString()}</p>
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
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Ordered Qty</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Received Qty</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Unit Price</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrder.items.map((item: any) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{item.product?.name}</td>
                  <td className="p-4">{item.product?.sku}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">{item.received}</td>
                  <td className="p-4">${item.unitPrice?.toFixed(2)}</td>
                  <td className="p-4 font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status Actions */}
        {!purchaseOrder.received && purchaseOrder.status === "APPROVED" && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Actions</h3>
            <p className="text-blue-700 mb-4">This purchase order is approved and ready for goods receiving.</p>
            <button
              onClick={handleReceiveGoods}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Confirm Goods Receiving
            </button>
          </div>
        )}

        {purchaseOrder.received && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-bold text-green-900 mb-2">✓ Purchase Order Received</h3>
            <p className="text-green-700">All goods have been received and stock has been updated.</p>
          </div>
        )}
      </div>
    </div>
  );
};
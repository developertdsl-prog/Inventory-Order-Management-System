import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const SupplierDetailPage = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplier();
  }, [id]);

  const loadSupplier = async () => {
    try {
      const response = await axiosInstance.get(`/suppliers/${id}`);
      setSupplier(response.data);
    } catch (err) {
      console.error("Error loading supplier:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Supplier Details</h2>
          {loading ? <p>Loading...</p> : <p>Supplier not found</p>}
          <Link
            to="/suppliers"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Suppliers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-3xl mx-auto">
      <nav className="mb-6">
        <Link to="/suppliers" className="text-blue-600 hover underline">
          ← Back to Suppliers
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">{supplier.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Contact</label>
            <p className="text-gray-900">{supplier.contact || <span className="text-gray-400 italic">Not provided</span>}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Purchase Orders</label>
            <p className="text-gray-900 font-bold">{supplier._count?.purchaseOrders ?? 0}</p>
          </div>
        </div>

        {supplier.purchaseOrders && supplier.purchaseOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Purchase Orders</h2>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">PO Number</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Total Amount</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Created</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplier.purchaseOrders.map((po: any) => (
                  <tr key={po.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{po.id}</td>
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
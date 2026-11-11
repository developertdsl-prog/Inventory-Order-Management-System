import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await axiosInstance.get("/suppliers");
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error loading suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.post("/suppliers", { name: newName, contact: newContact });
      setNewName("");
      setNewContact("");
      setShowForm(false);
      loadSuppliers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create supplier");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await axiosInstance.delete(`/suppliers/${id}`);
      loadSuppliers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete supplier");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-blue-600 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-white font-bold mr-4">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Suppliers</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Add Supplier
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Supplier</h2>
            <form onSubmit={handleCreateSupplier} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone or email"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Supplier
                </button>
              </div>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading suppliers...</div>
        ) : suppliers.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-lg">No suppliers found.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover underline"
            >
              Add your first supplier
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Name</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Contact</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Purchase Orders</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier: any) => (
                  <tr key={supplier.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{supplier.name}</td>
                    <td className="p-4">{supplier.contact || <span className="text-gray-400 italic">Not provided</span>}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                        {supplier._count?.purchaseOrders ?? 0} POs
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/suppliers/${supplier.id}`}
                          className="text-blue-600 hover underline text-sm"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="text-red-600 hover underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
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
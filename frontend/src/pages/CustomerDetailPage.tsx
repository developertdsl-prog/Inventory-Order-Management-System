import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    try {
      const response = await axiosInstance.get(`/customers/${id}`);
      setCustomer(response.data);
    } catch (err) {
      console.error("Error loading customer:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Customer Details</h2>
          {loading ? <p>Loading...</p> : <p>Customer not found</p>}
          <Link
            to="/customers"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-3xl mx-auto">
      <nav className="mb-6">
        <Link to="/customers" className="text-blue-600 hover underline">
          ← Back to Customers
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">{customer.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{customer.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Phone</label>
            <p className="text-gray-900">{customer.phone || <span className="text-gray-400 italic">Not provided</span>}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Address</label>
            <p className="text-gray-900">{customer.address || <span className="text-gray-400 italic">Not provided</span>}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Total Orders</label>
            <p className="text-gray-900 font-bold">{customer._count?.salesOrders ?? 0}</p>
          </div>
        </div>

        {customer.salesOrders && customer.salesOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Order Number</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Total Amount</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Created</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customer.salesOrders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "PENDING" ? "bg-yellow-100 text-yellow-600" :
                          order.status === "CONFIRMED" ? "bg-blue-100 text-blue-600" :
                          order.status === "SHIPPED" ? "bg-indigo-100 text-indigo-600" :
                          order.status === "DELIVERED" ? "bg-green-100 text-green-600" :
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">${order.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Link
                        to={`/sales-orders/${order.id}`}
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

interface SOItem {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
}

export const SalesOrderFormPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState<SOItem[]>([]);
  const [newProductId, setNewProductId] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnitPrice, setNewUnitPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        axiosInstance.get("/customers"),
        axiosInstance.get("/products"),
      ]);
      setCustomers(custRes.data);
      setProducts(prodRes.data.products);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const addItem = () => {
    const product = products.find((p: any) => p.id === newProductId);
    if (!product) {
      setError("Please select a product");
      return;
    }

    const qty = parseInt(newQuantity);
    const price = parseFloat(newUnitPrice);

    if (!qty || qty <= 0) {
      setError("Please enter valid quantity");
      return;
    }

    if (!price || price <= 0) {
      setError("Please enter valid unit price");
      return;
    }

    setItems([...items, {
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      quantity: qty,
      unitPrice: price,
    }]);

    setNewProductId("");
    setNewQuantity("");
    setNewUnitPrice("");
    setError("");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedCustomer) {
      setError("Please select a customer");
      setLoading(false);
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one item");
      setLoading(false);
      return;
    }

    try {
      const soItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      await axiosInstance.post("/sales-orders", {
        customerId: selectedCustomer,
        items: soItems,
      });

      navigate("/sales-orders");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create sales order");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-4xl mx-auto">
      <nav className="mb-6">
        <a href="/sales-orders" className="text-blue-600 hover underline">
          ← Back to Sales Orders
        </a>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Create Sales Order</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select customer</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Add Item Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Add Item</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select product</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - Stock: {p.stock}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newUnitPrice}
                  onChange={(e) => setNewUnitPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Items Table */}
          {items.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">Items</h2>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Product</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">SKU</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Quantity</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Unit Price</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Total</th>
                    <th className="p-3 text-center text-sm font-medium text-gray-700 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.productName}</td>
                      <td className="p-3">{item.productSku}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover underline text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3 font-bold" colSpan={4}>Total Amount</td>
                    <td className="p-3 font-bold">${getTotalAmount().toFixed(2)}</td>
                    <td className="p-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => navigate("/sales-orders")}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Sales Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
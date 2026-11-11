import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category?: { id: string; name: string } | null;
}

interface InventoryMovement {
  id: string;
  type: string;
  quantity: number;
  referenceId: string;
  referenceType: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
}

export const InventoryPage = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustType, setAdjustType] = useState("stock-in");
  const [adjustProductId, setAdjustProductId] = useState("");
  const [adjustQuantity, setAdjustQuantity] = useState("");
  const [adjustRefId, setAdjustRefId] = useState("");
  const [adjustRefType, setAdjustRefType] = useState("Manual");
  const [showAdjustment, setShowAdjustment] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const [prodRes, moveRes] = await Promise.all([
        axiosInstance.get("/products"),
        axiosInstance.get("/inventory/movements", { params: { limit: 10 } }),
      ]);
      setProducts(prodRes.data.products);
      setMovements(moveRes.data.transactions);
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (adjustType === "stock-in") {
        await axiosInstance.post("/inventory/stock-in", {
          productId: adjustProductId,
          quantity: parseInt(adjustQuantity),
          referenceId: adjustRefId,
          referenceType: adjustRefType,
        });
      } else if (adjustType === "stock-out") {
        await axiosInstance.post("/inventory/stock-out", {
          productId: adjustProductId,
          quantity: parseInt(adjustQuantity),
          referenceId: adjustRefId,
          referenceType: adjustRefType,
        });
      } else {
        // Adjustment: calculate new stock value
        const product = products.find(p => p.id === adjustProductId);
        if (!product) {
          setError("Product not found");
          return;
        }
        const newStock = product.stock + (adjustType === "adjust-in" ? parseInt(adjustQuantity) : -parseInt(adjustQuantity));
        await axiosInstance.post("/inventory/adjust", {
          productId: adjustProductId,
          newStock: Math.max(0, newStock),
          referenceId: adjustRefId,
          referenceType: adjustRefType,
        });
      }

      setSuccess("Stock updated successfully");
      setAdjustProductId("");
      setAdjustQuantity("");
      setAdjustRefId("");
      loadInventory();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update stock");
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
        {/* Stock Adjustment Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Stock Adjustment</h2>
          {showAdjustment ? (
            <form onSubmit={handleStockAdjustment} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType("stock-in")}
                  className={`flex-1 px-3 py-2 border rounded ${adjustType === "stock-in" ? "bg-green-600 text-white" : "text-gray-600 border-gray-300"}`}
                >
                  Stock In (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType("stock-out")}
                  className={`flex-1 px-3 py-2 border rounded ${adjustType === "stock-out" ? "bg-red-600 text-white" : "text-gray-600 border-gray-300"}`}
                >
                  Stock Out (-)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType("adjust-in")}
                  className={`flex-1 px-3 py-2 border rounded ${adjustType === "adjust-in" ? "bg-blue-600 text-white" : "text-gray-600 border-gray-300"}`}
                >
                  Adjust In (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType("adjust-out")}
                  className={`flex-1 px-3 py-2 border rounded ${adjustType === "adjust-out" ? "bg-blue-600 text-white" : "text-gray-600 border-gray-300"}`}
                >
                  Adjust Out (-)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select
                    value={adjustProductId}
                    onChange={(e) => setAdjustProductId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
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
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
                  <input
                    value={adjustRefId}
                    onChange={(e) => setAdjustRefId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., PO-12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Type</label>
                  <select
                    value={adjustRefType}
                    onChange={(e) => setAdjustRefType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Manual">Manual Adjustment</option>
                    <option value="PurchaseOrder">Purchase Order</option>
                    <option value="SalesOrder">Sales Order</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdjustment(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAdjustment(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Stock Adjustment
            </button>
          )}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8">
          <h3 className="text-red-800 font-bold mb-3">⚠ Low Stock Alerts</h3>
          {loading || products.length === 0 ? (
            <p className="text-red-600">Loading...</p>
          ) : (
            <div className={products.filter(p => p.stock < 10).length === 0 ? "text-green-600" : ""}>
              {products.filter(p => p.stock < 10).length > 0 ? (
                <ul className="space-y-2">
                  {products
                    .filter((p) => p.stock < 10)
                    .slice(0, 5)
                    .map((p) => (
                      <li key={p.id} className="text-red-600 text-sm flex justify-between">
                        <span>{p.name}</span>
                        <span className="font-bold">Stock: {p.stock}</span>
                      </li>
                    ))}
                  </ul>
                  {products.filter(p => p.stock < 10).length > 5 && (
                    <p className="text-sm text-red-600">and {products.filter(p => p.stock < 10).length - 5} more...</p>
                  )}
                ) : (
                  <p className="text-green-600 text-sm">All products are well-stocked ✓</p>
                )}
              }
            </div>
          )}
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Inventory List</h2>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500">{products.length} products</span>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">SKU</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Product Name</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Category</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Current Stock</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">Loading inventory...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">No products found</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{product.sku}</td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">
                      {product.category?.name || <span className="text-gray-400 italic">Uncategorized</span>}
                    </td>
                    <td className="p-4 font-medium">
                      {product.stock < 10 ? (
                        <span className="text-red-600">{product.stock}</span>
                      ) : product.stock < 20 ? (
                        <span className="text-yellow-600">{product.stock}</span>
                      ) : (
                        <span className="text-green-600">{product.stock}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.stock < 10
                            ? "bg-red-100 text-red-600"
                            : product.stock < 20
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {product.stock < 10 ? "Low Stock" : product.stock < 20 ? "Reorder Soon" : "In Stock"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stock Movement History */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
          <h2 className="text-xl font-bold mb-4">Stock Movement History</h2>
          {loading ? (
            <p className="text-center py-6">Loading movements...</p>
          ) : movements.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No stock movements recorded</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Date</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Product</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Type</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Quantity</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Reference</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Reference Type</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm">{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm">{m.product.name}</td>
                    <td className="p-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          m.type === "STOCK_IN" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {m.type === "STOCK_IN" ? "Stock In (+)" : "Stock Out (-)"}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium">{m.quantity}</td>
                    <td className="p-4 text-sm">{m.referenceId || "-"}</td>
                    <td className="p-4 text-sm">{m.referenceType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
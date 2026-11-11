import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [search, categoryFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productRes, categoryRes] = await Promise.all([
        axiosInstance.get("/products", {
          params: { search: search || undefined, category: categoryFilter || undefined },
        }),
        axiosInstance.get("/categories"),
      ]);
      setProducts(productRes.data.products);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      loadData();
    } catch (error) {
      console.error("Delete error:", error);
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
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate("/products/new")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-medium text-gray-700 border-b">SKU</th>
                  <th className="p-4 font-medium text-gray-700 border-b">Product Name</th>
                  <th className="p-4 font-medium text-gray-700 border-b">Category</th>
                  <th className="p-4 font-medium text-gray-700 border-b">Price</th>
                  <th className="p-4 font-medium text-gray-700 border-b">Stock</th>
                  <th className="p-4 font-medium text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{product.sku}</td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">
                      {product.category?.name || <span className="text-gray-400 italic">Uncategorized</span>}
                    </td>
                    <td className="p-4">${product.price?.toFixed(2)}</td>
                    <td className="p-4 font-medium">
                      {product.stock < 10 ? (
                        <span className="text-red-600">{product.stock}</span>
                      ) : (
                        <span className="text-gray-900">{product.stock}</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-2">
                      <Link to={`/products/${product.id}`} className="text-blue-600 hover underline">
                        View
                      </Link>
                      <button
                        onClick={() => navigate(`/products/${product.id}/edit`)}
                        className="text-yellow-600 hover underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover underline"
                      >
                        Delete
                      </button>
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
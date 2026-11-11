import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.post("/categories", { name: newCategoryName });
      setNewCategoryName("");
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      loadCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-xl mx-auto">
      <nav className="mb-6">
        <Link to="/dashboard" className="text-blue-600 hover underline">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Category Management</h2>

        <form onSubmit={handleCreateCategory} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Category
          </button>
          {error && <span className="text-red-500 text-sm ml-2 self-center">{error}</span>}
        </form>

        {loading ? (
          <div className="text-center py-10">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No categories yet. Add your first category above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat: any) => (
              <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                    {cat._count?.products ?? 0} products
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-xs text-red-600 hover underline px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
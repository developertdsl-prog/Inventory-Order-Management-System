import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Product Details</h2>
          {loading ? <p>Loading...</p> : <p>Product not found</p>}
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-3xl mx-auto">
      <nav className="mb-6">
        <Link to="/products" className="text-blue-600 hover underline">
          ← Back to Products
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">{product.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">SKU</label>
              <p className="text-gray-900">{product.sku}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Barcode</label>
              <p className="text-gray-900">{product.barcode || <span className="text-gray-400 italic">Not assigned</span>}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Category</label>
              <p className="text-gray-900">{product.category?.name || <span className="text-gray-400 italic">Uncategorized</span>}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Price</label>
              <p className="text-gray-900 font-bold">${product.price?.toFixed(2)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Stock Quantity</label>
              <p className={`text-2xl font-bold ${product.stock < 10 ? "text-red-600" : "text-gray-900"}`}>
                {product.stock} units
              </p>
              {product.stock < 10 && (
                <span className="text-xs text-red-600 font-medium">⚠ Low stock alert</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900">{product.description || <span className="text-gray-400 italic">No description</span>}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {product.images && product.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Product Images</h3>
            <div className="flex gap-4">
              {product.images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/products/${product.id}/edit`)}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Edit Product
          </button>
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};
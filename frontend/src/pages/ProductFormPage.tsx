import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../api/apiClient";

export const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit] = useState(!!id);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const initialValues = {
    name: "",
    description: "",
    price: "",
    sku: "",
    barcode: "",
    stock: "0",
    categoryId: "",
    images: "",
  };

  useEffect(() => {
    loadCategories();
    if (isEdit) loadProduct();
  }, [id, isEdit]);

  const loadCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadProduct = async () => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      const product = response.data;
      // Form will be populated - in production, use reset from react-hook-form
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        sku: data.sku,
        barcode: data.barcode || undefined,
        stock: parseInt(data.stock),
        categoryId: data.categoryId || undefined,
        images: data.images ? [data.images] : [],
      };

      if (isEdit && id) {
        await axiosInstance.put(`/products/${id}`, productData);
      } else {
        await axiosInstance.post("/products", productData);
      }
      navigate("/products");
    } catch (error: any) {
      console.error("Save error:", error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-lg mx-auto">
      <nav className="mb-6">
        <Link to="/products" className="text-blue-600 hover underline">
          ← Back to Products
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              {...register("name", { required: "Name is required" })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : ""}`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : ""}`}
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input
                {...register("sku", { required: "SKU is required" })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sku ? "border-red-500" : ""}`}
                placeholder="Enter SKU"
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
              <input
                {...register("barcode")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter barcode"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required", valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? "border-red-500" : ""}`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              {...register("categoryId")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              {...register("images")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="https://example.com/product-image.jpg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
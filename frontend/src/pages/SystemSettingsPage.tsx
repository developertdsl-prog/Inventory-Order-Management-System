import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const SystemSettingsPage = () => {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const response = await axiosInstance.get("/config");
      setConfigs(response.data.configMap);
    } catch (err) {
      console.error("Error loading configs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string) => {
    setError("");
    try {
      await axiosInstance.put(`/config/${key}`, { value: newValue });
      setEditingKey(null);
      setNewValue("");
      loadConfigs();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update configuration");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would need key, value, category from form
    alert("Create configuration functionality would be implemented here");
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

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>

        {loading ? (
          <div className="text-center py-10">Loading settings...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Key</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Value</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(configs).map(([key, value]) => (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{key}</td>
                    <td className="p-4">
                      {editingKey === key ? (
                        <input
                          type="text"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-gray-700">{value}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editingKey === key ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(key)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingKey(key);
                            setNewValue(value);
                          }}
                          className="text-blue-600 hover underline text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {Object.keys(configs).length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No system configurations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Available Settings Categories</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• <strong>general:</strong> General system settings</li>
            <li>• <strong>email:</strong> Email notification settings</li>
            <li>• <strong>inventory:</strong> Inventory management settings</li>
            <li>• <strong>order:</strong> Order processing settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const UserPreferencesPage = () => {
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await axiosInstance.get("/preferences");
      setPreferences(response.data);
    } catch (err) {
      console.error("Error loading preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      await axiosInstance.put("/preferences", {
        emailNotifications: formData.get("emailNotifications") === "on",
        lowStockNotifications: formData.get("lowStockNotifications") === "on",
        orderStatusNotifications: formData.get("orderStatusNotifications") === "on",
        theme: formData.get("theme"),
        language: formData.get("language"),
      });
      setSuccess("Preferences saved successfully");
      loadPreferences();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <nav className="bg-blue-600 p-4 mb-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/dashboard" className="text-white font-bold mr-4">
              ← Back to Dashboard
            </Link>
          </div>
        </nav>
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center py-10">
            <p>Loading preferences...</p>
          </div>
        </div>
      </div>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-blue-600 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-white font-bold mr-4">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">User Preferences</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    defaultChecked={preferences.emailNotifications}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Email Notifications</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lowStockNotifications"
                    defaultChecked={preferences.lowStockNotifications}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Low Stock Alerts</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="orderStatusNotifications"
                    defaultChecked={preferences.orderStatusNotifications}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Order Status Updates</span>
                </label>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select
                    name="theme"
                    defaultValue={preferences.theme}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    name="language"
                    defaultValue={preferences.language}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => loadPreferences()}
                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        {success && <p className="mt-4 text-green-500 text-sm">{success}</p>}
      </div>
    </div>
  );
};
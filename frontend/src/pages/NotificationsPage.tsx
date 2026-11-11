import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await axiosInstance.get("/notifications", {
        params: { limit: 50, unreadOnly: "false" },
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/notifications/read-all");
      loadNotifications();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to mark all as read");
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      LOW_STOCK: "bg-orange-100 text-orange-600",
      ORDER_STATUS: "bg-blue-100 text-blue-600",
      PURCHASE: "bg-green-100 text-green-600",
      SYSTEM: "bg-purple-100 text-purple-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-blue-600 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="text-white font-bold mr-4">
            ← Back to Dashboard
          </Link>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 text-white hover:opacity-80 rounded"
          >
            Mark All as Read
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        {loading ? (
          <div className="text-center py-10">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 text-lg">No notifications yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Type</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Title</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Message</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700 border-b">Created</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification: any) => (
                  <tr
                    key={notification.id}
                    className={`border-b hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}
                      >
                        {notification.type}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{notification.title}</td>
                    <td className="p-4">{notification.message}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          notification.read
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {notification.read ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover underline text-sm"
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Notification Types</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• <strong>LOW_STOCK:</strong> Alerts when products fall below threshold</li>
            <li>• <strong>ORDER_STATUS:</strong> Updates on sales order status changes</li>
            <li>• <strong>PURCHASE:</strong> Notifications for purchase order updates</li>
            <li>• <strong>SYSTEM:</strong> System-wide announcements and alerts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
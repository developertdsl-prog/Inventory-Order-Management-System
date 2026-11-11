import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/apiClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Element,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Element,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const ReportsPage = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [purchaseReport, setPurchaseReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadReports();
  }, [startDate, endDate]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [salesRes, purchaseRes, inventoryRes, summaryRes] = await Promise.all([
        axiosInstance.get("/reports/sales", { params }),
        axiosInstance.get("/reports/purchases", { params }),
        axiosInstance.get("/reports/inventory"),
        axiosInstance.get("/reports/dashboard-summary"),
      ]);

      setSalesReport(salesRes.data);
      setPurchaseReport(purchaseRes.data);
      setInventoryReport(inventoryRes.data);
      setDashboardSummary(summaryRes.data);
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for sales by date
  const salesChartData = salesReport?.salesByDate
    ? {
        labels: Object.keys(salesReport.salesByDate),
        datasets: [
          {
            label: "Sales ($)",
            data: Object.values(salesReport.salesByDate).map((d: any) => d.sales),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Prepare chart data for purchases by date
  const purchaseChartData = purchaseReport?.purchasesByDate
    ? {
        labels: Object.keys(purchaseReport.purchasesByDate),
        datasets: [
          {
            label: "Purchases ($)",
            data: Object.values(purchaseReport.purchasesByDate).map((d: any) => d.purchases),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Prepare chart data for top products
  const topProductsChartData = salesReport?.topProducts
    ? {
        labels: salesReport.topProducts.slice(0, 5).map((p: any) => p.name),
        datasets: [
          {
            label: "Revenue ($)",
            data: salesReport.topProducts.slice(0, 5).map((p: any) => p.revenue),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Prepare chart data for category breakdown
  const categoryChartData = inventoryReport?.categoryBreakdown
    ? {
        labels: Object.keys(inventoryReport.categoryBreakdown),
        datasets: [
          {
            label: "Stock Value ($)",
            data: Object.values(inventoryReport.categoryBreakdown).map((c: any) => c.stockValue),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : { labels: [], datasets: [] };

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
        <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>

        {/* Date Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Filter Reports</h2>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={loadReports}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-8"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        {dashboardSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <p className="text-sm font-medium text-gray-500 uppercase">Total Sales</p>
              <p className="text-2xl font-bold text-blue-600">${dashboardSummary.sales.totalAmount?.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{dashboardSummary.sales.count} orders</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <p className="text-sm font-medium text-gray-500 uppercase">Total Purchases</p>
              <p className="text-2xl font-bold text-green-600">${dashboardSummary.purchases.totalAmount?.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{dashboardSummary.purchases.count} orders</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
              <p className="text-sm font-medium text-gray-500 uppercase">Total Products</p>
              <p className="text-2xl font-bold text-purple-600">{dashboardSummary.products.count}</p>
              <p className="text-sm text-gray-500">{dashboardSummary.products.lowStockCount} low stock</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
              <p className="text-sm font-medium text-gray-500 uppercase">Inventory Value</p>
              <p className="text-2xl font-bold text-orange-600">${dashboardSummary.products.totalStockValue?.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Total stock value</p>
            </div>
          </div>
        )}

        {/* Sales Report */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Sales Report</h2>
          {loading ? (
            <p className="text-center py-6">Loading sales report...</p>
          ) : salesReport ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">${salesReport.totalSales?.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{salesReport.totalOrders} orders</p>
              </div>
              <div className="h-64">
                <Bar data={salesChartData} options={{ responsive: true, plugins: { title: { display: true, text: "Sales by Date" } } }} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No sales data available</p>
          )}
        </div>

        {/* Purchase Report */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Purchase Report</h2>
          {loading ? (
            <p className="text-center py-6">Loading purchase report...</p>
          ) : purchaseReport ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Total Purchases</p>
                <p className="text-2xl font-bold text-red-600">${purchaseReport.totalPurchases?.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{purchaseReport.totalOrders} orders</p>
              </div>
              <div className="h-64">
                <Bar data={purchaseChartData} options={{ responsive: true, plugins: { title: { display: true, text: "Purchases by Date" } } }} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No purchase data available</p>
          )}
        </div>

        {/* Top Products Chart */}
        {salesReport?.topProducts && salesReport.topProducts.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">Top Products by Revenue</h2>
            <div className="h-64">
              <Bar
                data={topProductsChartData}
                options={{
                  responsive: true,
                  plugins: { title: { display: true, text: "Top 5 Products by Revenue" } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
            <table className="w-full mt-6">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Product</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">SKU</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Quantity</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesReport.topProducts.slice(0, 10).map((p: any) => (
                  <tr key={p.sku} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">{p.quantity}</td>
                    <td className="p-3 text-right font-medium">${p.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Inventory Report */}
        {inventoryReport && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">Inventory Valuation Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 uppercase">Total Inventory Value</p>
                <p className="text-xl font-bold">${inventoryReport.totalInventoryValue?.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 uppercase">Total Products</p>
                <p className="text-xl font-bold">{inventoryReport.totalProducts}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 uppercase">Low Stock Items</p>
                <p className="text-xl font-bold text-red-600">{inventoryReport.lowStockCount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <Bar data={categoryChartData} options={{ responsive: true, plugins: { title: { display: true, text: "Inventory Value by Category" } } }} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Low Stock Alerts</h3>
                {inventoryReport.lowStockItems.length > 0 ? (
                  <ul className="space-y-2">
                    {inventoryReport.lowStockItems.map((item: any) => (
                      <li key={item.sku} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                        <span>{item.name} ({item.sku})</span>
                        <span className="text-red-600 font-bold">{item.stock} units</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600">No low stock items</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Export Reports</h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const data = JSON.stringify({ salesReport, purchaseReport, inventoryReport, dashboardSummary }, null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "reports-export.json";
                a.click();
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Export JSON
            </button>
            <button
              onClick={() => {
                alert("CSV export functionality would be implemented here");
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                alert("PDF export functionality would be implemented here");
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
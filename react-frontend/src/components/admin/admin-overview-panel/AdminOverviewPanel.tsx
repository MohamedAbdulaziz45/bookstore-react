import { useState, useEffect, useCallback, useMemo } from "react";
import { getDashboardSummary } from "../../../services/adminService";
import type { AdminDashboardSummary } from "../../../types/admin.types";

const CHART_LABELS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const statusClass = (status: string) => status.toLowerCase();

const buildStatCards = (summary: AdminDashboardSummary | null) => [
  {
    icon: "bi-currency-dollar",
    iconBg: "#fff8e6",
    iconColor: "var(--gold)",
    value: formatCurrency(summary?.totalRevenue ?? 0),
    label: "Total Revenue",
    change: "Live API total",
    changeDir: "up",
    sparkHeights: [40, 60, 45, 80, 100],
    sparkGradient: "linear-gradient(to top, var(--gold), rgba(225,169,43,.4))",
  },
  {
    icon: "bi-bag-check",
    iconBg: "#e8f5e9",
    iconColor: "#198754",
    value: String(summary?.totalOrders ?? 0),
    label: "Total Orders",
    change: "All order statuses",
    changeDir: "up",
    sparkHeights: [50, 70, 55, 90, 75],
    sparkGradient: "linear-gradient(to top,#198754,rgba(25,135,84,.3))",
  },
  {
    icon: "bi-people",
    iconBg: "#e3f2fd",
    iconColor: "#0d6efd",
    value: String(summary?.totalCustomers ?? 0),
    label: "Total Customers",
    change: "Active customers",
    changeDir: "up",
    sparkHeights: [30, 55, 40, 70, 85],
    sparkGradient: "linear-gradient(to top,#0d6efd,rgba(13,110,253,.3))",
  },
  {
    icon: "bi-book",
    iconBg: "#fce4ec",
    iconColor: "#e91e63",
    value: String(summary?.totalBooks ?? 0),
    label: "Books",
    change: `${summary?.lowStockBooks.length ?? 0} low stock alerts`,
    changeDir: "down",
    sparkHeights: [60, 80, 65, 45, 90],
    sparkGradient: "linear-gradient(to top,#e91e63,rgba(233,30,99,.3))",
  },
];

export default function AdminOverviewPanel() {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDashboardSummary();
      setSummary(res.data);
    } catch {
      setError("Could not load dashboard summary.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const statCards = useMemo(() => buildStatCards(summary), [summary]);

  const chartHeight = (label: string) => {
    const breakdown = summary?.orderStatusBreakdown ?? {};
    const max = Math.max(...Object.values(breakdown), 1);
    return ((breakdown[label] ?? 0) / max) * 100;
  };

  if (loading) return <div className="admin-state">Loading dashboard...</div>;
  if (error) return <div className="admin-state error">{error}</div>;

  return (
    <div className="admin-panel active d-block">
      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div key={card.label} className="col-md-3">
            <div className="stat-card">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div
                  className="stat-icon-box"
                  style={{ background: card.iconBg }}
                >
                  <i
                    className={`bi ${card.icon}`}
                    style={{ color: card.iconColor }}
                  />
                </div>
                <div className="sparkline" style={{ width: 60 }}>
                  {card.sparkHeights.map((h, idx) => (
                    <div
                      key={idx}
                      className="spark-bar"
                      style={{
                        height: `${h}%`,
                        background: card.sparkGradient,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
              <div
                className={`stat-change ${card.changeDir === "up" ? "change-up" : "change-down"}`}
              >
                <i
                  className={`bi ${card.changeDir === "up" ? "bi-arrow-up-short" : "bi-arrow-down-short"}`}
                />
                {card.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Top Selling Books */}
      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <div className="data-card">
            <div className="data-card-header">
              <span className="dash-section-title">Order Status Breakdown</span>
            </div>
            <div style={{ padding: 20 }}>
              <div className="chart-container">
                {CHART_LABELS.map((label) => (
                  <div key={label} className="chart-bar-wrap">
                    <div
                      className="chart-bar"
                      style={{ height: `${chartHeight(label)}%` }}
                      title={`${summary?.orderStatusBreakdown?.[label] ?? 0} orders`}
                    />
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "0 8px",
                  marginTop: 4,
                }}
              >
                {CHART_LABELS.map((label) => (
                  <div
                    key={label}
                    className="chart-label"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="data-card h-100">
            <div className="data-card-header">
              <span className="dash-section-title">Top Selling Books</span>
              <a
                href="javascript:void(0)"
                style={{
                  fontSize: ".8rem",
                  color: "var(--gold)",
                  textDecoration: "none",
                }}
              >
                See all
              </a>
            </div>
            <div style={{ padding: "8px 0" }}>
              {(summary?.topSellingBooks ?? []).map((book, i, arr) => (
                <div
                  key={book.bookId}
                  className="top-book-row"
                  style={{
                    borderBottom:
                      i === arr.length - 1
                        ? "none"
                        : "1px solid var(--brand-border)",
                  }}
                >
                  <div className="top-book-rank">{i + 1}</div>
                  <div className="book-thumb">
                    <i
                      className="bi bi-book"
                      style={{ fontSize: ".8rem", color: "var(--gold)" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: ".87rem", fontWeight: 600 }}>
                      {book.title}
                    </div>
                    <div
                      style={{ fontSize: ".75rem", color: "var(--brand-gray)" }}
                    >
                      {book.author}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: ".87rem",
                        fontWeight: 700,
                        color: "var(--gold)",
                      }}
                    >
                      {book.sold} sold
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="section-header">
        <div className="dash-section-title">Recent Orders</div>
        <button className="btn-outline-gold">View All Orders</button>
      </div>
      <div className="data-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Books</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {(summary?.recentOrders ?? []).map((order) => (
              <tr key={order.orderId}>
                <td>
                  <span style={{ fontWeight: 600, color: "var(--gold)" }}>
                    #ORD-{order.orderId}
                  </span>
                </td>
                <td>{order.customer}</td>
                <td>{order.itemsCount} items</td>
                <td>{formatCurrency(order.amount)}</td>
                <td>
                  <span
                    className={`status-badge status-${statusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ color: "var(--brand-gray)" }}>
                  {formatDate(order.orderDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

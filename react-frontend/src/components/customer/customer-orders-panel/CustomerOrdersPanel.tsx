import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import * as orderService from "../../../services/orderService";
import { showToast } from "../../../utils/toast";
import type { Order } from "../../../types/orders.types";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function CustomerOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data ?? []))
      .catch(() => showToast("Failed to load orders", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = (order: Order) => {
    if (order.status !== "Pending") {
      showToast("Only pending orders can be cancelled", "info");
      return;
    }
    if (!confirm(`Cancel order #${order.orderId}?`)) return;

    orderService
      .cancelOrder(order.orderId)
      .then(() => {
        showToast("Order cancelled", "success");
        load();
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          "Failed to cancel order. Please try again.";
        showToast(msg, "error");
      });
  };

  return (
    <>
      <div className="section-heading">My Orders</div>

      {/* Loading */}
      {isLoading && (
        <div className="card-box text-center py-4">
          <div className="spinner-border text-gold" role="status" />
          <div className="text-muted mt-3">Loading your orders...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && orders.length === 0 && (
        <div className="card-box text-center py-4">
          <div style={{ fontWeight: 800 }}>No orders yet</div>
          <div className="text-muted mt-1">
            After checkout, your orders will appear here.
          </div>
        </div>
      )}

      {/* Order Cards */}
      {orders.map((order) => (
        <div className="order-card" key={order.orderId}>
          <div className="order-card-header">
            <div>
              <div className="order-id">#ORD-{order.orderId}</div>
              <div className="order-date">
                {formatDate(order.orderDate)} · {order.orderItems.length}{" "}
                item(s)
              </div>
            </div>
            <span
              className={`status-badge status-${(order.status ?? "").toLowerCase()}`}
            >
              {order.status}
            </span>
          </div>

          <div className="order-card-body">
            {order.orderItems.map((item) => (
              <div className="order-item" key={item.orderItemId}>
                <div className="book-cover-sm">
                  <i className="bi bi-book" style={{ color: "var(--gold)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                    Book #{item.bookId}
                  </div>
                  <div
                    style={{ fontSize: "0.78rem", color: "var(--brand-gray)" }}
                  >
                    Qty: {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "var(--gold)" }}>
                  {item.totalItemsPrice.toFixed(2)} EGP
                </div>
              </div>
            ))}
          </div>

          <div className="order-card-footer">
            <div style={{ fontSize: "0.85rem", color: "var(--brand-gray)" }}>
              Total:{" "}
              <strong style={{ color: "var(--brand-dark)" }}>
                {order.totalAmount.toFixed(2)} EGP
              </strong>
            </div>
            <div className="d-flex gap-2">
              <Link className="track-btn" to={`/orders/${order.orderId}`}>
                <i className="bi bi-truck" /> Details
              </Link>
              {order.status === "Pending" && (
                <button
                  className="track-btn"
                  style={{ borderColor: "#dc3545", color: "#dc3545" }}
                  onClick={() => cancel(order)}
                >
                  <i className="bi bi-x-circle" /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

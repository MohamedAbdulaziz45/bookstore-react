import { useState, useEffect, useCallback, useMemo } from "react";
import * as orderService from "../../../services/orderService";
import type { AdminOrder } from "../../../types/admin.types";
import type { OrderStatus } from "../../../types/orders.types";

const STATUS_MAP: Record<OrderStatus, number> = {
  Pending: 0,
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 4,
};

const statusLabel = (order: AdminOrder): OrderStatus => {
  if (typeof order.status === "number") {
    return (
      (Object.keys(STATUS_MAP) as OrderStatus[]).find(
        (s) => STATUS_MAP[s] === order.status,
      ) ?? "Pending"
    );
  }
  return order.status as OrderStatus;
};

const statusClass = (order: AdminOrder) => statusLabel(order).toLowerCase();

const nextActions = (
  order: AdminOrder,
): { label: string; status: OrderStatus }[] => {
  switch (statusLabel(order)) {
    case "Pending":
      return [
        { label: "Processing", status: "Processing" },
        { label: "Cancel", status: "Cancelled" },
      ];
    case "Processing":
      return [
        { label: "Shipped", status: "Shipped" },
        { label: "Cancel", status: "Cancelled" },
      ];
    case "Shipped":
      return [{ label: "Delivered", status: "Delivered" }];
    default:
      return [];
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatDate = (value: string) => new Date(value).toLocaleDateString();

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? orders.filter(
          (o) =>
            String(o.orderId).includes(term) ||
            (o.customerName ?? "").toLowerCase().includes(term),
        )
      : [...orders];
  }, [orders, search]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await orderService.getAllOrders();
      setOrders(res.data);
    } catch {
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const changeStatus = async (order: AdminOrder, status: OrderStatus) => {
    setLoading(true);
    setError("");
    try {
      await orderService.updateOrderStatus(order.orderId, STATUS_MAP[status]);
      await loadOrders();
    } catch {
      setError("Could not update order status.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel active d-block">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="dash-section-title">Orders Management</div>
        <div className="search-wrap">
          <i className="bi bi-search" />
          <input
            className="search-input"
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="data-card">
        {/* States */}
        {loading && <div className="admin-state">Loading orders...</div>}
        {!loading && error && <div className="admin-state error">{error}</div>}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="admin-state">No orders found.</div>
        )}

        {/* Table */}
        {!loading && !error && filteredOrders.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--gold)" }}>
                      #ORD-{order.orderId}
                    </span>
                  </td>
                  <td>
                    {order.customerName || `Customer #${order.customerId}`}
                  </td>
                  <td>{order.itemsCount ?? order.orderItems?.length ?? 0}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>{order.payment?.paymentMethod || "Unpaid"}</td>
                  <td>
                    <span
                      className={`status-badge status-${statusClass(order)}`}
                    >
                      {statusLabel(order)}
                    </span>
                  </td>
                  <td style={{ color: "var(--brand-gray)" }}>
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="action-cell">
                    <button
                      className="action-btn edit"
                      type="button"
                      title="View order"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <i className="bi bi-eye" />
                    </button>
                    {nextActions(order).map((action) => (
                      <button
                        key={action.status}
                        className="btn-mini-status"
                        type="button"
                        onClick={() => void changeStatus(order, action.status)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedOrder && (
        <>
          <div
            className="admin-modal-backdrop"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="admin-drawer">
            <div className="drawer-header">
              <div className="dash-section-title">
                Order #{selectedOrder.orderId}
              </div>
              <button
                className="action-btn"
                type="button"
                title="Close"
                onClick={() => setSelectedOrder(null)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="drawer-body">
              <div className="detail-row">
                <span>Customer</span>
                <strong>{selectedOrder.customerName}</strong>
              </div>
              <div className="detail-row">
                <span>Total</span>
                <strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <strong>{statusLabel(selectedOrder)}</strong>
              </div>
              <div className="detail-row">
                <span>Date</span>
                <strong>{formatDate(selectedOrder.orderDate)}</strong>
              </div>
              <div className="detail-row">
                <span>Payment</span>
                <strong>
                  {selectedOrder.payment?.paymentMethod || "Unpaid"}
                </strong>
              </div>
              <div className="detail-row">
                <span>Shipping</span>
                <strong>
                  {selectedOrder.shipping?.trackingNumber || "Not created"}
                </strong>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

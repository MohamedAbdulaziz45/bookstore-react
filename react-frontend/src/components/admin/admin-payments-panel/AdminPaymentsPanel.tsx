import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllPayments } from "../../../services/paymentService";
import type { AdminPayment } from "../../../types/admin.types";

const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase() === "EGP" ? "EGP" : "USD",
  }).format(value);

const formatDate = (value: string) => new Date(value).toLocaleDateString();

export default function AdminPaymentsPanel() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(
    null,
  );

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? payments.filter(
          (p) =>
            String(p.paymentId).includes(term) ||
            String(p.orderId).includes(term) ||
            (p.customer ?? "").toLowerCase().includes(term),
        )
      : [...payments];
  }, [payments, search]);

  const totalCollected = useMemo(
    () => payments.reduce((sum, p) => sum + p.amount, 0),
    [payments],
  );

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllPayments();
      setPayments(res.data);
    } catch {
      setError("Could not load payments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  return (
    <div className="admin-panel active d-block">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="dash-section-title">Payments</div>
        <div className="search-wrap">
          <i className="bi bi-search" />
          <input
            className="search-input"
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--gold)" }}>
              {formatCurrency(totalCollected)}
            </div>
            <div className="stat-label">Total Collected</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-value" style={{ color: "#198754" }}>
              {payments.length}
            </div>
            <div className="stat-label">Payments</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-value" style={{ color: "#dc3545" }}>
              0
            </div>
            <div className="stat-label">Refund records</div>
          </div>
        </div>
      </div>

      <div className="data-card">
        {/* States */}
        {loading && <div className="admin-state">Loading payments...</div>}
        {!loading && error && <div className="admin-state error">{error}</div>}
        {!loading && !error && filteredPayments.length === 0 && (
          <div className="admin-state">No payments found.</div>
        )}

        {/* Table */}
        {!loading && !error && filteredPayments.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((pay) => (
                <tr key={pay.paymentId}>
                  <td>
                    <span style={{ fontWeight: 600 }}>
                      #PAY-{pay.paymentId}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--gold)" }}>
                      #ORD-{pay.orderId}
                    </span>
                  </td>
                  <td>{pay.customer || "Unknown"}</td>
                  <td>
                    <i
                      className="bi bi-credit-card-2-front me-2"
                      style={{ color: "var(--brand-gray)" }}
                    />
                    {pay.paymentMethod}
                  </td>
                  <td>{formatCurrency(pay.amount, pay.currency)}</td>
                  <td style={{ color: "var(--brand-gray)" }}>
                    {formatDate(pay.transactionDate)}
                  </td>
                  <td>
                    <button
                      className="action-btn edit"
                      type="button"
                      title="View payment"
                      onClick={() => setSelectedPayment(pay)}
                    >
                      <i className="bi bi-eye" />
                    </button>
                    <a
                      className="action-btn edit"
                      title="View order"
                      href={`/orders/${pay.orderId}`}
                    >
                      <i className="bi bi-receipt" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPayment && (
        <>
          <div
            className="admin-modal-backdrop"
            onClick={() => setSelectedPayment(null)}
          />
          <div className="admin-modal">
            <div className="drawer-header">
              <div className="dash-section-title">
                Payment #{selectedPayment.paymentId}
              </div>
              <button
                className="action-btn"
                type="button"
                title="Close"
                onClick={() => setSelectedPayment(null)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="drawer-body">
              <div className="detail-row">
                <span>Order</span>
                <strong>#ORD-{selectedPayment.orderId}</strong>
              </div>
              <div className="detail-row">
                <span>Customer</span>
                <strong>{selectedPayment.customer}</strong>
              </div>
              <div className="detail-row">
                <span>Amount</span>
                <strong>
                  {formatCurrency(
                    selectedPayment.amount,
                    selectedPayment.currency,
                  )}
                </strong>
              </div>
              <div className="detail-row">
                <span>Method</span>
                <strong>{selectedPayment.paymentMethod}</strong>
              </div>
              <div className="detail-row">
                <span>Stripe intent</span>
                <strong>
                  {selectedPayment.stripePaymentIntentId || "None"}
                </strong>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

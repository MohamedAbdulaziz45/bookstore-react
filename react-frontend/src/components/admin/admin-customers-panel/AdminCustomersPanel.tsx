import { useState, useEffect, useCallback, useMemo } from "react";
import * as customerService from "../../../services/customerService";
import type { AdminCustomer } from "../../../types/admin.types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const initials = (customer: AdminCustomer) =>
  customer.displayName.slice(0, 2).toUpperCase();

export default function AdminCustomersPanel() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<AdminCustomer | null>(null);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? customers.filter(
          (c) =>
            c.displayName.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) ||
            (c.phone ?? "").toLowerCase().includes(term),
        )
      : [...customers];
  }, [customers, search]);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await customerService.getAllCustomers(undefined, 100);
      setCustomers(res.data.items);
    } catch {
      setError("Could not load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const deactivate = async (customer: AdminCustomer) => {
    if (customer.isDeleted) return;
    if (!confirm(`Deactivate customer "${customer.displayName}"?`)) return;

    setLoading(true);
    try {
      await customerService.deactivateCustomer(customer.customerId);
      setSelectedCustomer(null);
      await loadCustomers();
    } catch {
      setError("Could not deactivate customer.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel active d-block">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="dash-section-title">Customers</div>
        <div className="search-wrap">
          <i className="bi bi-search" />
          <input
            className="search-input"
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="data-card">
        {/* States */}
        {loading && <div className="admin-state">Loading customers...</div>}
        {!loading && error && <div className="admin-state error">{error}</div>}
        {!loading && !error && filteredCustomers.length === 0 && (
          <div className="admin-state">No customers found.</div>
        )}

        {/* Table */}
        {!loading && !error && filteredCustomers.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Member Since</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust.customerId}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {cust.imagePath ? (
                        <img
                          className="avatar-sm"
                          src={cust.imagePath}
                          alt=""
                        />
                      ) : (
                        <div className="avatar-sm">{initials(cust)}</div>
                      )}
                      <span style={{ fontWeight: 600, fontSize: ".87rem" }}>
                        {cust.displayName}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: "var(--brand-gray)" }}>{cust.email}</td>
                  <td style={{ color: "var(--brand-gray)" }}>
                    {cust.phone || "None"}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{cust.ordersCount}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--gold)" }}>
                    {formatCurrency(cust.totalSpent)}
                  </td>
                  <td style={{ color: "var(--brand-gray)" }}>
                    {formatDate(cust.memberSince)}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${cust.isDeleted ? "status-cancelled" : "status-shipped"}`}
                    >
                      {cust.isDeleted ? "Deactivated" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn edit"
                      type="button"
                      title="View customer"
                      onClick={() => setSelectedCustomer(cust)}
                    >
                      <i className="bi bi-eye" />
                    </button>
                    <button
                      className="action-btn del"
                      type="button"
                      title="Deactivate customer"
                      disabled={cust.isDeleted}
                      onClick={() => void deactivate(cust)}
                    >
                      <i className="bi bi-person-x" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedCustomer && (
        <>
          <div
            className="admin-modal-backdrop"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="admin-drawer">
            <div className="drawer-header">
              <div className="dash-section-title">
                {selectedCustomer.displayName}
              </div>
              <button
                className="action-btn"
                type="button"
                title="Close"
                onClick={() => setSelectedCustomer(null)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="drawer-body">
              <div className="detail-row">
                <span>Email</span>
                <strong>{selectedCustomer.email}</strong>
              </div>
              <div className="detail-row">
                <span>Phone</span>
                <strong>{selectedCustomer.phone || "None"}</strong>
              </div>
              <div className="detail-row">
                <span>Orders</span>
                <strong>{selectedCustomer.ordersCount}</strong>
              </div>
              <div className="detail-row">
                <span>Total spent</span>
                <strong>{formatCurrency(selectedCustomer.totalSpent)}</strong>
              </div>
              <div className="detail-row">
                <span>Member since</span>
                <strong>{formatDate(selectedCustomer.memberSince)}</strong>
              </div>
              <button
                className="btn-outline-cust mt-3"
                type="button"
                disabled={selectedCustomer.isDeleted}
                onClick={() => void deactivate(selectedCustomer)}
              >
                Deactivate
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

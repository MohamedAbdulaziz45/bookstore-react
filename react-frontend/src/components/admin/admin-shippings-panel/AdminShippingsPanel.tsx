import { useState, useEffect, useCallback, useMemo } from "react";
import * as shippingsService from "../../../services/shippingsService";
import type {
  AdminShipping,
  AdminShippingFormValue,
} from "../../../types/admin.types";

const STATUS_OPTIONS = [
  { label: "Pending", value: 0 },
  { label: "In Transit", value: 1 },
  { label: "Out For Delivery", value: 2 },
  { label: "Delivered", value: 3 },
  { label: "Failed", value: 4 },
  { label: "Returned", value: 5 },
];

const emptyForm = (): AdminShippingFormValue => ({
  carrierName: "",
  trackingNumber: "",
  shippingStatus: 0,
  estimatedDeliveryDate: new Date().toISOString().slice(0, 10),
  actualDeliveryDate: null,
  orderId: 0,
});

const statusValue = (status: string | number): number => {
  if (typeof status === "number") return status;
  const normalized = status.replace(/\s+/g, "").toLowerCase();
  return (
    STATUS_OPTIONS.find(
      (o) => o.label.replace(/\s+/g, "").toLowerCase() === normalized,
    )?.value ?? 0
  );
};

const statusLabel = (status: string | number): string =>
  STATUS_OPTIONS.find((o) => o.value === statusValue(status))?.label ??
  "Pending";

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString();

export default function AdminShippingsPanel() {
  const [shippings, setShippings] = useState<AdminShipping[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingShipping, setEditingShipping] = useState<AdminShipping | null>(
    null,
  );
  const [form, setForm] = useState<AdminShippingFormValue>(emptyForm());

  const filteredShippings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? shippings.filter(
          (s) =>
            s.trackingNumber.toLowerCase().includes(term) ||
            s.carrierName.toLowerCase().includes(term) ||
            String(s.orderId).includes(term) ||
            (s.customer ?? "").toLowerCase().includes(term),
        )
      : [...shippings];
  }, [shippings, search]);

  const loadShippings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await shippingsService.getAllShippings();
      setShippings(res.data);
    } catch {
      setError("Could not load shippings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadShippings();
  }, [loadShippings]);

  const openCreate = () => {
    setEditingShipping(null);
    setForm(emptyForm());
    setIsDrawerOpen(true);
  };

  const openEdit = (shipping: AdminShipping) => {
    setEditingShipping(shipping);
    setForm({
      carrierName: shipping.carrierName,
      trackingNumber: shipping.trackingNumber,
      shippingStatus: statusValue(shipping.shippingStatus),
      estimatedDeliveryDate: shipping.estimatedDeliveryDate.slice(0, 10),
      actualDeliveryDate: shipping.actualDeliveryDate?.slice(0, 10) ?? null,
      orderId: shipping.orderId,
    });
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const setField = <K extends keyof AdminShippingFormValue>(
    key: K,
    value: AdminShippingFormValue[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (
      !form.carrierName.trim() ||
      !form.trackingNumber.trim() ||
      !form.estimatedDeliveryDate ||
      form.orderId <= 0
    ) {
      setError(
        "Carrier, tracking number, order, and estimated delivery are required.",
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (editingShipping) {
        await shippingsService.updateShipping(editingShipping.shippingId, form);
      } else {
        await shippingsService.createShipping(form);
      }
      setIsDrawerOpen(false);
      await loadShippings();
    } catch {
      setError("Could not save shipping.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel active d-block">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="dash-section-title">Shippings Tracker</div>
        <div className="d-flex gap-2">
          <div className="search-wrap">
            <i className="bi bi-search" />
            <input
              className="search-input"
              type="text"
              placeholder="Tracking number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-gold-dash" type="button" onClick={openCreate}>
            <i className="bi bi-plus-lg" /> Add
          </button>
        </div>
      </div>

      <div className="data-card">
        {loading && <div className="admin-state">Loading shippings...</div>}
        {!loading && error && <div className="admin-state error">{error}</div>}
        {!loading && !error && filteredShippings.length === 0 && (
          <div className="admin-state">No shippings found.</div>
        )}

        {!loading && !error && filteredShippings.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking No.</th>
                <th>Order ID</th>
                <th>Carrier</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Est. Delivery</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShippings.map((shp) => (
                <tr key={shp.shippingId}>
                  <td>
                    <span
                      style={{ fontWeight: 600, color: "var(--brand-dark)" }}
                    >
                      <i
                        className="bi bi-box-seam me-2"
                        style={{ color: "var(--brand-gray)" }}
                      />
                      {shp.trackingNumber}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--gold)" }}>
                      #ORD-{shp.orderId}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: "var(--brand-warm)",
                        color: "var(--brand-dark)",
                      }}
                    >
                      {shp.carrierName}
                    </span>
                  </td>
                  <td>{shp.customer || "Unknown"}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className={`track-dot ${statusValue(shp.shippingStatus) === 3 ? "done" : "current"}`}
                        style={{ width: 8, height: 8, padding: 0 }}
                      />
                      <span style={{ fontSize: ".83rem", fontWeight: 600 }}>
                        {statusLabel(shp.shippingStatus)}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {formatDate(shp.estimatedDeliveryDate)}
                  </td>
                  <td>
                    <button
                      className="action-btn edit"
                      type="button"
                      title="Edit tracking"
                      onClick={() => openEdit(shp)}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <a
                      className="action-btn edit"
                      title="View order"
                      href={`/orders/${shp.orderId}`}
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

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          <div className="admin-modal-backdrop" onClick={closeDrawer} />
          <div className="admin-drawer">
            <div className="drawer-header">
              <div className="dash-section-title">
                {editingShipping ? "Edit Shipping" : "Add Shipping"}
              </div>
              <button
                className="action-btn"
                type="button"
                title="Close"
                onClick={closeDrawer}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="drawer-body">
              <label className="form-label-sm">Order ID</label>
              <input
                className="form-control-custom mb-3"
                type="number"
                min={1}
                value={form.orderId}
                disabled={!!editingShipping}
                onChange={(e) => setField("orderId", Number(e.target.value))}
              />

              <label className="form-label-sm">Carrier</label>
              <input
                className="form-control-custom mb-3"
                type="text"
                value={form.carrierName}
                onChange={(e) => setField("carrierName", e.target.value)}
              />

              <label className="form-label-sm">Tracking number</label>
              <input
                className="form-control-custom mb-3"
                type="text"
                value={form.trackingNumber}
                onChange={(e) => setField("trackingNumber", e.target.value)}
              />

              <label className="form-label-sm">Status</label>
              <select
                className="form-control-custom mb-3"
                value={form.shippingStatus}
                onChange={(e) =>
                  setField("shippingStatus", Number(e.target.value))
                }
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <label className="form-label-sm">Estimated delivery</label>
              <input
                className="form-control-custom mb-3"
                type="date"
                value={form.estimatedDeliveryDate}
                onChange={(e) =>
                  setField("estimatedDeliveryDate", e.target.value)
                }
              />

              <label className="form-label-sm">Actual delivery</label>
              <input
                className="form-control-custom mb-4"
                type="date"
                value={form.actualDeliveryDate ?? ""}
                onChange={(e) =>
                  setField("actualDeliveryDate", e.target.value || null)
                }
              />

              <div className="d-flex gap-2">
                <button
                  className="btn-gold-cust"
                  type="button"
                  onClick={() => void submit()}
                >
                  Save
                </button>
                <button
                  className="btn-outline-cust"
                  type="button"
                  onClick={closeDrawer}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import AddressFormModal from "../../address-form-modal/AddressFormModal";
import * as addressService from "../../../services/addressService";
import { showToast } from "../../../utils/toast";
import type { IAddress } from "../../../types/address.types";

interface CustomerAddressesPanelProps {
  onAddressCountChange?: (count: number) => void;
}

const getLabelIcon = (label: string) => {
  if (label === "Home") return "bi-house";
  if (label === "Office") return "bi-building";
  return "bi-geo-alt";
};

export default function CustomerAddressesPanel({
  onAddressCountChange,
}: CustomerAddressesPanelProps) {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | undefined>();

  const loadAddresses = useCallback(() => {
    setIsLoading(true);
    addressService
      .getMyAddresses()
      .then((res) => {
        setAddresses(res.data);
        onAddressCountChange?.(res.data.length);
      })
      .catch(() => showToast("Failed to load addresses", "error"))
      .finally(() => setIsLoading(false));
  }, [onAddressCountChange]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const openAddModal = () => {
    setEditingAddress(undefined);
    setShowModal(true);
  };

  const openEditModal = (address: IAddress) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const onAddressSaved = (_address: IAddress) => {
    setShowModal(false);
    setEditingAddress(undefined);
    loadAddresses();
  };

  const onModalClosed = () => {
    setShowModal(false);
    setEditingAddress(undefined);
  };

  const deleteAddress = (address: IAddress) => {
    if (!confirm(`Remove "${address.label}" address?`)) return;
    addressService
      .deleteAddress(address.addressId)
      .then(() => {
        showToast("Address removed", "success");
        loadAddresses();
      })
      .catch(() => showToast("Failed to remove address", "error"));
  };

  const setDefault = (address: IAddress) => {
    addressService
      .setDefaultAddress(address.addressId)
      .then(() => {
        showToast(`"${address.label}" set as default`, "success");
        loadAddresses();
      })
      .catch(() => showToast("Failed to set default address", "error"));
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="section-heading mb-0">Saved Addresses</div>
        <button
          className="btn-gold-cust"
          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
          onClick={openAddModal}
        >
          <i className="bi bi-plus-lg me-1" />
          Add New
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="spinner-border text-gold" role="status" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && addresses.length === 0 && (
        <div
          className="text-center py-5"
          style={{ color: "var(--brand-gray)" }}
        >
          <i
            className="bi bi-geo-alt"
            style={{ fontSize: "2.5rem", opacity: 0.4 }}
          />
          <p className="mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
            No saved addresses yet. Add one to get started.
          </p>
        </div>
      )}

      {/* Address Cards */}
      {!isLoading && addresses.length > 0 && (
        <div className="row g-3">
          {addresses.map((addr) => (
            <div className="col-md-6" key={addr.addressId}>
              <div
                className="card-box h-100"
                style={{ position: "relative", padding: 20, marginBottom: 0 }}
              >
                {/* Default Badge */}
                {addr.isDefault && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontSize: "0.7rem",
                      background: "rgba(225, 169, 43, 0.15)",
                      color: "var(--gold)",
                      padding: "3px 8px",
                      borderRadius: 20,
                      fontWeight: 700,
                    }}
                  >
                    DEFAULT
                  </div>
                )}

                {/* Label */}
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <i
                    className={`bi ${getLabelIcon(addr.label)}`}
                    style={{ color: "var(--brand-gray)" }}
                  />
                  {addr.label}
                </div>

                {/* Full Name */}
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {addr.fullName}
                </div>

                {/* Address Details */}
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--brand-gray)",
                    lineHeight: 1.6,
                  }}
                >
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}
                  <br />
                  {addr.city}
                  {addr.state && `, ${addr.state}`} {addr.postalCode}
                  <br />
                  {addr.country}
                </div>

                {/* Phone */}
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--brand-gray)",
                    marginTop: 8,
                  }}
                >
                  <i className="bi bi-telephone me-2" />
                  {addr.phone}
                </div>

                {/* Actions */}
                <div
                  className="d-flex gap-3 mt-3 pt-3"
                  style={{ borderTop: "1px solid var(--brand-border)" }}
                >
                  <button
                    className="btn btn-link p-0"
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--brand-dark)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                    onClick={() => openEditModal(addr)}
                  >
                    Edit
                  </button>
                  {!addr.isDefault && (
                    <button
                      className="btn btn-link p-0"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--gold)",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                      onClick={() => setDefault(addr)}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    className="btn btn-link p-0"
                    style={{
                      fontSize: "0.8rem",
                      color: "#dc3545",
                      textDecoration: "none",
                    }}
                    onClick={() => deleteAddress(addr)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AddressFormModal
        isOpen={showModal}
        address={editingAddress}
        isFirstAddress={addresses.length === 0}
        onSaved={onAddressSaved}
        onClosed={onModalClosed}
      />
    </>
  );
}

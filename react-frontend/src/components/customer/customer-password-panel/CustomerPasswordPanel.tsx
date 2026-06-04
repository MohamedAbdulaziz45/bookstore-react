import { useState } from "react";
import ChangePasswordModal from "../../change-password-modal/ChangePasswordModal";

export default function CustomerPasswordPanel() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="section-heading">Change Password</div>

      <div className="card-box">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "var(--brand-warm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="bi bi-shield-lock"
              style={{ fontSize: "1.3rem", color: "var(--gold)" }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              Password & Security
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--brand-gray)" }}>
              Manage your account password
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--brand-gray)",
            marginBottom: 20,
          }}
        >
          Keep your account secure by using a strong, unique password that you
          don't use on other sites.
        </p>

        <div
          style={{
            marginBottom: 16,
            padding: "14px 16px",
            background: "var(--brand-bg)",
            borderRadius: 10,
            border: "1px solid var(--brand-border)",
          }}
        >
          <div
            style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 8 }}
          >
            Password Requirements:
          </div>
          <ul
            style={{
              fontSize: "0.82rem",
              color: "var(--brand-gray)",
              margin: 0,
              paddingLeft: 18,
              lineHeight: 1.8,
            }}
          >
            <li>At least 8 characters long</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character</li>
          </ul>
        </div>

        <button className="btn-gold-cust" onClick={() => setShowModal(true)}>
          <i className="bi bi-pencil-square me-1" /> Change Password
        </button>
      </div>

      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </>
  );
}

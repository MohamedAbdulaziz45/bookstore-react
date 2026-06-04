import { useState } from "react";
import { changePassword } from "../../services/auth/authService";
import { showToast } from "../../utils/toast";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async () => {
    setErrorMsg("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMsg("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword, confirmNewPassword);
      showToast("Password updated successfully", "success");
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        "Failed to update password. Check your current password.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1040,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Dialog */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div className="card-box" style={{ maxWidth: 480, margin: "0 auto" }}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              <i className="bi bi-shield-lock me-2" />
              Change Password
            </div>
            <button
              className="btn-close"
              style={{ filter: "invert(1)", opacity: 0.5 }}
              onClick={onClose}
            />
          </div>

          <p
            style={{
              fontSize: ".85rem",
              color: "var(--brand-gray)",
              marginBottom: 20,
            }}
          >
            Ensure your account is using a strong password for security.
          </p>

          {/* Fields */}
          <div className="row g-3">
            <div className="col-12">
              <div className="form-label-sm">Current Password</div>
              <input
                className="form-control-custom"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="col-md-6">
              <div className="form-label-sm">New Password</div>
              <input
                className="form-control-custom"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="col-md-6">
              <div className="form-label-sm">Confirm New Password</div>
              <input
                className="form-control-custom"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div
              className="alert alert-danger mt-3 mb-0 py-2"
              style={{ fontSize: ".82rem", borderRadius: 8 }}
            >
              {errorMsg}
            </div>
          )}

          {/* Password requirements */}
          <div
            style={{
              marginTop: 16,
              padding: "14px 16px",
              background: "var(--brand-bg)",
              borderRadius: 10,
              border: "1px solid var(--brand-border)",
            }}
          >
            <div
              style={{ fontWeight: 600, fontSize: ".85rem", marginBottom: 8 }}
            >
              Password Requirements:
            </div>
            <ul
              style={{
                fontSize: ".82rem",
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

          {/* Actions */}
          <div className="d-flex gap-2 mt-4">
            <button
              className="btn-gold-cust"
              disabled={isSubmitting}
              onClick={() => void onSubmit()}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
            <button className="btn-outline-cust" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect, useCallback } from "react";
import {
  getUserDetails,
  updateUser,
  changePassword as changePasswordService,
} from "../../../services/auth/authService";

export default function AdminSettingsPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({
    displayName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await getUserDetails();
      const user = res.data;
      setProfile({
        displayName: user.displayName ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phoneNumber: user.phoneNumber ?? "",
      });
    } catch {
      setError("Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const onImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(e.target.files?.[0] ?? null);
  };

  const saveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await updateUser({ ...profile, image: selectedImage ?? undefined });
      setSuccess("Profile updated.");
    } catch {
      setError("Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.newPassword !== password.confirmNewPassword) {
      setError("Password confirmation does not match.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await changePasswordService(
        password.currentPassword,
        password.newPassword,
        password.confirmNewPassword,
      );
      setSuccess("Password changed.");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch {
      setError("Could not change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel active d-block">
      <div className="dash-section-title mb-4">Settings</div>

      {loading && <div className="admin-state">Saving...</div>}
      {error && <div className="admin-state error mb-3">{error}</div>}
      {success && <div className="admin-state success mb-3">{success}</div>}

      {/* Admin Profile */}
      <div className="card-box mb-4">
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: ".95rem" }}>
          <i className="bi bi-person-circle me-2" />
          Admin Profile
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-label-sm">Display Name</div>
            <input
              className="form-control-custom"
              type="text"
              value={profile.displayName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, displayName: e.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <div className="form-label-sm">Phone</div>
            <input
              className="form-control-custom"
              type="tel"
              value={profile.phoneNumber}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <div className="form-label-sm">First Name</div>
            <input
              className="form-control-custom"
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, firstName: e.target.value }))
              }
            />
          </div>
          <div className="col-md-6">
            <div className="form-label-sm">Last Name</div>
            <input
              className="form-control-custom"
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, lastName: e.target.value }))
              }
            />
          </div>
          <div className="col-md-12">
            <div className="form-label-sm">Profile Image</div>
            <input
              className="form-control-custom"
              type="file"
              accept="image/*"
              onChange={onImageSelected}
            />
          </div>
        </div>
        <div className="d-flex gap-2 mt-4">
          <button
            className="btn-gold-cust"
            type="button"
            onClick={() => void saveProfile()}
          >
            Save Changes
          </button>
          <button
            className="btn-outline-cust"
            type="button"
            onClick={() => void loadProfile()}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="card-box mb-4">
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: ".95rem" }}>
          <i className="bi bi-shield-lock me-2" />
          Password
        </div>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="form-label-sm">Current Password</div>
            <input
              className="form-control-custom"
              type="password"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-4">
            <div className="form-label-sm">New Password</div>
            <input
              className="form-control-custom"
              type="password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-4">
            <div className="form-label-sm">Confirm Password</div>
            <input
              className="form-control-custom"
              type="password"
              value={password.confirmNewPassword}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  confirmNewPassword: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="d-flex gap-2 mt-4">
          <button
            className="btn-gold-cust"
            type="button"
            onClick={() => void handleChangePassword()}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

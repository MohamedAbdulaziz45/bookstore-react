import { useState, useEffect, useCallback } from "react";
import * as authService from "../../../services/auth/authService";
import { getImageUrl } from "../../../utils/imageUtils";
import { showToast } from "../../../utils/toast";
import type { IUserDetails } from "../../../types/auth.types";

const PHONE_REGEX = /^\+?[0-9\s-]{7,15}$/;

interface CustomerProfilePanelProps {
  onProfileUpdated?: (user: IUserDetails) => void;
}

interface FormState {
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const emptyForm = (): FormState => ({
  displayName: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
});

export default function CustomerProfilePanel({
  onProfileUpdated,
}: CustomerProfilePanelProps) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [currentUserData, setCurrentUserData] = useState<IUserDetails | null>(
    null,
  );
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── validation ────────────────────────────────────────────────────────────
  const errors = {
    firstName:
      form.firstName.length > 0 &&
      (form.firstName.length < 2 || form.firstName.length > 50),
    lastName:
      form.lastName.length > 0 &&
      (form.lastName.length < 2 || form.lastName.length > 50),
    phoneNumber:
      form.phoneNumber.length > 0 && !PHONE_REGEX.test(form.phoneNumber),
  };
  const isFormInvalid = Object.values(errors).some(Boolean);

  // ── load profile ──────────────────────────────────────────────────────────
  const patchForm = useCallback((user: IUserDetails) => {
    setForm({
      displayName: user.displayName ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
    });
    setTouched({});
  }, []);

  const loadProfile = useCallback(() => {
    setIsLoading(true);
    authService
      .getUserDetails()
      .then((res) => {
        const user = res.data;
        setCurrentUserData(user);
        setCurrentImageUrl(user.imagePath ?? null);
        patchForm(user);
      })
      .catch(() => showToast("Failed to load profile information", "error"))
      .finally(() => setIsLoading(false));
  }, [patchForm]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ── handlers ──────────────────────────────────────────────────────────────
  const onChange = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const onBlur = (field: keyof FormState) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const resetForm = () => {
    if (!currentUserData) return;
    patchForm(currentUserData);
    setCurrentImageUrl(currentUserData.imagePath ?? null);
    setSelectedImage(null);
  };

  const onImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCurrentImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onImageError = () => setCurrentImageUrl(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // mark all as touched
    setTouched({ firstName: true, lastName: true, phoneNumber: true });
    if (isFormInvalid) return;

    setIsSubmitting(true);
    try {
      await authService.updateUser({
        displayName: form.displayName.trim() || undefined,
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
        image: selectedImage ?? undefined,
      });

      const updatedUser: IUserDetails = {
        ...(currentUserData ?? { email: form.email }),
        displayName: form.displayName.trim() || currentUserData?.displayName,
        firstName: form.firstName.trim() || currentUserData?.firstName,
        lastName: form.lastName.trim() || currentUserData?.lastName,
        phoneNumber: form.phoneNumber.trim() || currentUserData?.phoneNumber,
        imagePath: currentImageUrl ?? undefined,
      };

      setCurrentUserData(updatedUser);
      setSelectedImage(null);
      onProfileUpdated?.(updatedUser);
      showToast("Profile updated successfully", "success");
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        "Failed to update profile information";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="section-heading">Profile Info</div>

      {isLoading ? (
        <div className="card-box text-center py-4">
          <div className="spinner-border text-gold" role="status" />
          <div className="text-muted mt-3">Loading profile information...</div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <div className="card-box">
            {/* Avatar + image upload */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="customer-avatar-lg"
                style={{ width: 64, height: 64, fontSize: "1.15rem" }}
              >
                {currentImageUrl ? (
                  <img
                    src={getImageUrl(currentImageUrl, "avatar")}
                    alt="Profile image"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={onImageError}
                  />
                ) : (
                  <i className="bi bi-person-fill" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div className="form-label-sm">Profile Image</div>
                <input
                  className="form-control-custom"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onImageSelected}
                />
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--brand-gray)",
                    marginTop: 5,
                  }}
                >
                  {selectedImage
                    ? `Selected: ${selectedImage.name}`
                    : "JPG, PNG, or WebP up to 10MB."}
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-label-sm">Display Name</div>
                <input
                  className="form-control-custom"
                  type="text"
                  value={form.displayName}
                  onChange={(e) => onChange("displayName", e.target.value)}
                  placeholder="How your name appears"
                />
              </div>
              <div className="col-md-6">
                <div className="form-label-sm">Email Address</div>
                <input
                  className="form-control-custom"
                  type="email"
                  value={form.email}
                  disabled
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <div className="form-label-sm">First Name</div>
                <input
                  className="form-control-custom"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  onBlur={() => onBlur("firstName")}
                  placeholder="First name"
                />
                {touched.firstName && errors.firstName && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#dc3545",
                      marginTop: 5,
                    }}
                  >
                    First name must be 2-50 characters.
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <div className="form-label-sm">Last Name</div>
                <input
                  className="form-control-custom"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  onBlur={() => onBlur("lastName")}
                  placeholder="Last name"
                />
                {touched.lastName && errors.lastName && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#dc3545",
                      marginTop: 5,
                    }}
                  >
                    Last name must be 2-50 characters.
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <div className="form-label-sm">Phone Number</div>
                <input
                  className="form-control-custom"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => onChange("phoneNumber", e.target.value)}
                  onBlur={() => onBlur("phoneNumber")}
                  placeholder="+20 1234567890"
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#dc3545",
                      marginTop: 5,
                    }}
                  >
                    Enter a valid phone number.
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 mt-4">
              <button
                className="btn-gold-cust d-flex align-items-center gap-2"
                type="submit"
                disabled={isFormInvalid || isSubmitting}
              >
                {isSubmitting ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <i className="bi bi-check2" />
                )}
                Save Changes
              </button>
              <button
                className="btn-outline-cust"
                type="button"
                disabled={isSubmitting}
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

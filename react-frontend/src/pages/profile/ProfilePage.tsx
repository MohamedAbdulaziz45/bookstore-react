import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import * as authService from "../../services/auth/authService";
import { getImageUrl } from "../../utils/imageUtils";
import { showToast } from "../../utils/toast";
import type { IUserDetails } from "../../types/auth.types";

const PHONE_REGEX = /^\+?[0-9\s\-]{7,15}$/;

export default function ProfilePage() {
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    searchParams.get("message") ?? "",
  );

  const [currentUserData, setCurrentUserData] = useState<IUserDetails | null>(
    null,
  );
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    displayName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── load user ────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    authService
      .getUserDetails()
      .then((res) => {
        const user = res.data;
        setCurrentUserData(user);
        setCurrentImageUrl(user.imagePath ?? null);
        setForm({
          displayName: user.displayName ?? "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          phoneNumber: user.phoneNumber ?? "",
        });
      })
      .catch(() => showToast("Failed to load profile data", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  // ── validation ───────────────────────────────────────────────────────────
  const phoneInvalid =
    touched &&
    form.phoneNumber.length > 0 &&
    !PHONE_REGEX.test(form.phoneNumber);

  const isFormInvalid = phoneInvalid;

  // ── handlers ─────────────────────────────────────────────────────────────
  const onChange = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    if (!currentUserData) return;
    setForm({
      displayName: currentUserData.displayName ?? "",
      firstName: currentUserData.firstName ?? "",
      lastName: currentUserData.lastName ?? "",
      phoneNumber: currentUserData.phoneNumber ?? "",
    });
    setSelectedImage(null);
    setCurrentImageUrl(currentUserData.imagePath ?? null);
    setTouched(false);
  };

  const onImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCurrentImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onImageError = () => {
    setCurrentImageUrl(null);
    showToast("Failed to load image", "error");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isFormInvalid) return;

    setIsSubmitting(true);
    try {
      await authService.updateUser({
        displayName: form.displayName || undefined,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        phoneNumber: form.phoneNumber || undefined,
        image: selectedImage ?? undefined,
      });

      const updated: IUserDetails = {
        ...currentUserData!,
        ...Object.fromEntries(
          Object.entries(form).filter(([, v]) => v !== "" && v !== null),
        ),
      };
      if (selectedImage) {
        updated.imagePath = currentImageUrl ?? undefined;
        setSelectedImage(null);
      }
      setCurrentUserData(updated);
      setAlertMessage("");
      showToast("Profile updated successfully!", "success");
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <main>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              {/* Page Header */}
              <div className="mb-4">
                <span className="section-label">Account</span>
                <h2 className="section-title mb-0">My Profile</h2>
              </div>

              {/* Alert */}
              {alertMessage && (
                <div
                  className="alert alert-warning alert-dismissible fade show d-flex align-items-center gap-2"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill" />
                  <span>{alertMessage}</span>
                  <button
                    type="button"
                    className="btn-close ms-auto"
                    onClick={() => setAlertMessage("")}
                    aria-label="Close"
                  />
                </div>
              )}

              {/* Loading */}
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-gold" role="status" />
                </div>
              ) : (
                <div
                  className="card-box p-0"
                  style={{ borderRadius: 16, overflow: "hidden" }}
                >
                  {/* Card Top Banner */}
                  <div className="account-hero py-4 px-4 px-md-5">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="customer-avatar-lg"
                        style={{ fontSize: "1.3rem" }}
                      >
                        {currentImageUrl ? (
                          <img
                            src={getImageUrl(currentImageUrl, "avatar")}
                            alt="Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                            onError={onImageError}
                          />
                        ) : (
                          <i className="bi bi-person-fill" />
                        )}
                      </div>
                      <div>
                        <div
                          className="customer-name"
                          style={{ fontSize: "1.2rem" }}
                        >
                          {form.displayName || "Your Name"}
                        </div>
                        <span className="member-badge mt-1 d-inline-block">
                          Member
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form Body */}
                  <div className="p-4 p-md-5">
                    <form onSubmit={onSubmit} noValidate>
                      {/* Profile Image */}
                      <div className="mb-4">
                        <label className="form-label-sm">Profile Image</label>
                        <div className="d-flex gap-2 align-items-center">
                          <i className="bi bi-image text-gold fs-5" />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="form-control-custom flex-grow-1"
                            onChange={onImageSelected}
                          />
                        </div>
                        <div
                          className="mt-1"
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--brand-gray)",
                          }}
                        >
                          {selectedImage
                            ? `Selected: ${selectedImage.name}`
                            : "Accepted formats: jpg, png, webp. Max 5MB."}
                        </div>
                      </div>

                      <hr
                        style={{
                          borderColor: "var(--brand-border)",
                          margin: "1.5rem 0",
                        }}
                      />

                      {/* Name Row */}
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label-sm">First Name</label>
                          <input
                            type="text"
                            className="form-control-custom"
                            value={form.firstName}
                            onChange={(e) =>
                              onChange("firstName", e.target.value)
                            }
                            placeholder="John"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label-sm">Last Name</label>
                          <input
                            type="text"
                            className="form-control-custom"
                            value={form.lastName}
                            onChange={(e) =>
                              onChange("lastName", e.target.value)
                            }
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="mb-4">
                        <label className="form-label-sm">Phone Number</label>
                        <div className="d-flex gap-2 align-items-center">
                          <i className="bi bi-telephone text-gold fs-5" />
                          <input
                            type="tel"
                            className={`form-control-custom flex-grow-1${phoneInvalid ? " is-invalid" : ""}`}
                            value={form.phoneNumber}
                            onChange={(e) =>
                              onChange("phoneNumber", e.target.value)
                            }
                            onBlur={() => setTouched(true)}
                            placeholder="+20 1234567890"
                          />
                        </div>
                        {phoneInvalid && (
                          <div
                            className="mt-1"
                            style={{ fontSize: "0.75rem", color: "#dc3545" }}
                          >
                            Enter a valid phone number (7–15 digits).
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div
                        className="d-flex justify-content-end gap-2 pt-3"
                        style={{
                          borderTop: "1px solid var(--brand-border)",
                        }}
                      >
                        <button
                          type="button"
                          className="btn-outline-cust"
                          onClick={resetForm}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-gold-cust d-flex align-items-center gap-2"
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
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

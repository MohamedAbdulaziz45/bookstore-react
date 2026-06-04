import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Header from "../../components/header/Header";
import {
  useCartStore,
  selectCartItems,
  selectTotalPrice,
} from "../../store/useCartStore";
import * as addressService from "../../services/addressService";
import * as checkoutService from "../../services/checkoutService";
import type { ICreateAddressRequest } from "../../types/address.types";
import type { IAddress } from "../../types/address.types";
import AddressFormModal from "../../components/address-form-modal/AddressFormModal";
import "./CheckoutPage.css";

// ── helpers ────────────────────────────────────────────────────────────────
const getLabelIcon = (label: string) => {
  if (label === "Home") return "bi-house";
  if (label === "Office") return "bi-building";
  return "bi-geo-alt";
};

// ── component ──────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const cartItems = useCartStore(selectCartItems);
  const totalPrice = useCartStore(selectTotalPrice);

  // ── state ──────────────────────────────────────────────────────────────
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // ── inline address form ────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreateAddressRequest>({
    mode: "onTouched",
    defaultValues: {
      label: "Home",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: true,
    },
  });

  // ── load addresses ─────────────────────────────────────────────────────
  useEffect(() => {
    setIsLoadingAddresses(true);
    addressService
      .getMyAddresses()
      .then((res) => {
        const list = res.data;
        setAddresses(list);
        const def = list.find((a) => a.isDefault);
        setSelectedAddressId(
          def ? def.addressId : list.length > 0 ? list[0].addressId : null,
        );
      })
      .catch(() => toast.error("Failed to load addresses"))
      .finally(() => setIsLoadingAddresses(false));
  }, []);

  // ── handlers ───────────────────────────────────────────────────────────
  const payWithStripe = async (addressId: number) => {
    setIsProcessing(true);
    try {
      const res = await checkoutService.createSession(addressId);
      window.location.href = res.data.sessionUrl;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        "Failed to start checkout. Please try again.";
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  const onPayClick = () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    void payWithStripe(selectedAddressId);
  };

  const onSaveInlineAndCheckout = handleSubmit(async (formData) => {
    setIsProcessing(true);
    try {
      const res = await addressService.createAddress(formData);
      const newAddress: IAddress = {
        addressId: res.data.addressId,
        ...formData,
      };
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddressId(res.data.addressId);
      await payWithStripe(res.data.addressId);
    } catch {
      toast.error("Failed to save address");
      setIsProcessing(false);
    }
  });

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <>
      <Header />

      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div className="page-banner">
        <div className="container text-center">
          <h1 className="section-title mb-2">Checkout</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-gold">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/cart" className="text-gold">
                  Cart
                </Link>
              </li>
              <li className="breadcrumb-item active text-brand-gray">
                Checkout
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="section-py bg-brand">
        <div className="container">
          {/* ── Loading ─────────────────────────────────────────────────── */}
          {isLoadingAddresses ? (
            <div className="text-center py-5">
              <div className="spinner-border text-gold" role="status" />
              <p className="mt-3 text-muted">Loading your addresses...</p>
            </div>
          ) : (
            <div className="row g-5">
              {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
              <div className="col-lg-7">
                {/* STATE: Has addresses → picker */}
                {addresses.length > 0 ? (
                  <>
                    <h4 className="checkout-heading">
                      Select Shipping Address
                    </h4>

                    <div className="address-list">
                      {addresses.map((addr) => (
                        <div
                          key={addr.addressId}
                          className={`address-card${selectedAddressId === addr.addressId ? " selected" : ""}`}
                          onClick={() => setSelectedAddressId(addr.addressId)}
                        >
                          <div className="address-radio">
                            <div
                              className={`radio-dot${selectedAddressId === addr.addressId ? " active" : ""}`}
                            />
                          </div>

                          <div className="address-info">
                            <div className="address-label-row">
                              <span className="address-label">
                                <i
                                  className={`bi ${getLabelIcon(addr.label)}`}
                                />
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="default-badge">DEFAULT</span>
                              )}
                            </div>

                            <div className="address-name">{addr.fullName}</div>

                            <div className="address-detail">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                            </div>

                            <div className="address-detail">
                              {addr.city}
                              {addr.state && `, ${addr.state}`}{" "}
                              {addr.postalCode}
                            </div>

                            <div className="address-phone">
                              <i className="bi bi-telephone" /> {addr.phone}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn-add-address"
                      onClick={() => setShowAddressModal(true)}
                    >
                      <i className="bi bi-plus-lg" /> Add New Address
                    </button>
                  </>
                ) : (
                  /* STATE: No addresses → inline form */
                  <>
                    <h4 className="checkout-heading">Add Shipping Address</h4>
                    <p
                      className="text-muted mb-4"
                      style={{ fontSize: "0.9rem" }}
                    >
                      You don't have any saved addresses. Add one to continue.
                    </p>

                    <form
                      className="inline-address-form"
                      onSubmit={onSaveInlineAndCheckout}
                      noValidate
                    >
                      {/* Label */}
                      <div className="form-group">
                        <label className="form-label-sm">Label</label>
                        <input
                          type="text"
                          className="form-control-custom"
                          placeholder="e.g. Home, Office"
                          {...register("label", {
                            required: true,
                            maxLength: 50,
                          })}
                        />
                        {errors.label && (
                          <div className="field-error">Label is required</div>
                        )}
                      </div>

                      {/* Full Name + Phone */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label-sm">Full Name</label>
                            <input
                              type="text"
                              className="form-control-custom"
                              placeholder="John Doe"
                              {...register("fullName", {
                                required: true,
                                maxLength: 150,
                              })}
                            />
                            {errors.fullName && (
                              <div className="field-error">
                                Full name is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label-sm">Phone</label>
                            <input
                              type="tel"
                              className="form-control-custom"
                              placeholder="+20 1234567890"
                              {...register("phone", {
                                required: true,
                                maxLength: 30,
                              })}
                            />
                            {errors.phone && (
                              <div className="field-error">
                                Phone is required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Address Line 1 */}
                      <div className="form-group">
                        <label className="form-label-sm">Address Line 1</label>
                        <input
                          type="text"
                          className="form-control-custom"
                          placeholder="Street address"
                          {...register("addressLine1", {
                            required: true,
                            maxLength: 250,
                          })}
                        />
                        {errors.addressLine1 && (
                          <div className="field-error">Address is required</div>
                        )}
                      </div>

                      {/* Address Line 2 */}
                      <div className="form-group">
                        <label className="form-label-sm">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          className="form-control-custom"
                          placeholder="Apartment, suite, floor"
                          {...register("addressLine2", { maxLength: 250 })}
                        />
                      </div>

                      {/* City + State */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label-sm">City</label>
                            <input
                              type="text"
                              className="form-control-custom"
                              placeholder="Cairo"
                              {...register("city", {
                                required: true,
                                maxLength: 100,
                              })}
                            />
                            {errors.city && (
                              <div className="field-error">
                                City is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label-sm">
                              State (Optional)
                            </label>
                            <input
                              type="text"
                              className="form-control-custom"
                              placeholder="e.g. Cairo Governorate"
                              {...register("state", { maxLength: 100 })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Postal Code + Country */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label-sm">Postal Code</label>
                            <input
                              type="text"
                              className="form-control-custom"
                              placeholder="11511"
                              {...register("postalCode", {
                                required: true,
                                maxLength: 20,
                              })}
                            />
                            {errors.postalCode && (
                              <div className="field-error">
                                Postal code is required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label-sm">
                              Country Code
                            </label>
                            <input
                              type="text"
                              className="form-control-custom"
                              placeholder="EG"
                              maxLength={2}
                              style={{ textTransform: "uppercase" }}
                              {...register("country", {
                                required: true,
                                minLength: 2,
                                maxLength: 2,
                              })}
                            />
                            {errors.country && (
                              <div className="field-error">
                                2-letter country code required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>

              {/* ── RIGHT COLUMN: Order Summary ───────────────────────────── */}
              <div className="col-lg-5">
                <div className="order-summary sticky-top" style={{ top: 100 }}>
                  <h5 className="summary-heading">Your Order</h5>

                  {/* Cart items */}
                  {cartItems.map((item) => (
                    <div key={item.bookId} className="summary-item">
                      <div>
                        <h6 className="mb-0 fw-semibold">{item.title}</h6>
                        <small className="text-muted">x {item.quantity}</small>
                      </div>
                      <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="summary-row text-muted mt-4">
                    <span>Subtotal</span>
                    <span>{totalPrice.toFixed(2)} EGP</span>
                  </div>
                  <div className="summary-row text-muted border-bottom-custom pb-4 mb-4">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>{totalPrice.toFixed(2)} EGP</span>
                  </div>

                  {/* Pay button — address picker case */}
                  {addresses.length > 0 && (
                    <button
                      className="btn-pay"
                      disabled={
                        !selectedAddressId ||
                        isProcessing ||
                        cartItems.length === 0
                      }
                      onClick={onPayClick}
                    >
                      {isProcessing ? (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                      ) : (
                        <i className="bi bi-lock me-2" />
                      )}
                      {isProcessing
                        ? "Redirecting to payment..."
                        : "Pay with Stripe"}
                    </button>
                  )}

                  {/* Pay button — inline form case */}
                  {addresses.length === 0 && (
                    <button
                      className="btn-pay"
                      disabled={
                        !isValid || isProcessing || cartItems.length === 0
                      }
                      onClick={onSaveInlineAndCheckout}
                    >
                      {isProcessing ? (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                      ) : (
                        <i className="bi bi-lock me-2" />
                      )}
                      {isProcessing
                        ? "Redirecting to payment..."
                        : "Save Address & Pay"}
                    </button>
                  )}

                  <div className="secure-badge">
                    <i className="bi bi-shield-check" />
                    Payments are securely processed by Stripe
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Address Modal ────────────────────────────────────────────────── */}
      <AddressFormModal
        isOpen={showAddressModal}
        isFirstAddress={false}
        onSaved={(address: IAddress) => {
          setAddresses((prev) => [...prev, address]);
          setSelectedAddressId(address.addressId);
          setShowAddressModal(false);
        }}
        onClosed={() => setShowAddressModal(false)}
      />
    </>
  );
}

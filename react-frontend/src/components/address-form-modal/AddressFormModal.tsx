import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as addressService from "../../services/addressService";
import type {
  IAddress,
  ICreateAddressRequest,
} from "../../types/address.types";
import "./AddressFormModal.css";

// ── props ──────────────────────────────────────────────────────────────────
interface AddressFormModalProps {
  isOpen: boolean;
  address?: IAddress; // present → edit mode
  isFirstAddress?: boolean; // true → pre-fill label=Home, isDefault=true
  onSaved: (address: IAddress) => void;
  onClosed: () => void;
}

// ── component ──────────────────────────────────────────────────────────────
export default function AddressFormModal({
  isOpen,
  address,
  isFirstAddress = false,
  onSaved,
  onClosed,
}: AddressFormModalProps) {
  const isEditMode = !!address;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ICreateAddressRequest>({
    mode: "onTouched",
    defaultValues: {
      label: "",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    },
  });

  // Pre-fill when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (isEditMode && address) {
      reset(address);
    } else if (isFirstAddress) {
      reset((prev) => ({ ...prev, label: "Home", isDefault: true }));
    } else {
      reset();
    }
  }, [isOpen, address, isEditMode, isFirstAddress, reset]);

  // ── submit ─────────────────────────────────────────────────────────────
  const onSubmit = handleSubmit(async (formData) => {
    if (isEditMode && address) {
      try {
        await addressService.updateAddress(address.addressId, formData);
        const updated: IAddress = { ...address, ...formData };
        toast.success("Address updated successfully");
        onSaved(updated);
        close();
      } catch {
        toast.error("Failed to update address");
      }
    } else {
      try {
        const res = await addressService.createAddress(formData);
        const created: IAddress = {
          addressId: res.data.addressId,
          ...formData,
        };
        toast.success("Address saved successfully");
        onSaved(created);
        close();
      } catch {
        toast.error("Failed to save address");
      }
    }
  });

  const close = () => {
    reset();
    onClosed();
  };

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal-backdrop")) {
      close();
    }
  };

  // ── render ─────────────────────────────────────────────────────────────
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onBackdropClick}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h5 className="modal-title">
            <i className={`bi ${isEditMode ? "bi-pencil" : "bi-plus-lg"}`} />
            {isEditMode ? "Edit Address" : "Add New Address"}
          </h5>
          <button type="button" className="btn-close-modal" onClick={close}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} noValidate>
          <div className="modal-body">
            {/* Label */}
            <div className="form-group">
              <label className="form-label-sm">Label</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. Home, Office"
                {...register("label", { required: true, maxLength: 50 })}
              />
              {errors.label && (
                <div className="field-error">
                  Label is required (max 50 characters)
                </div>
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
                    <div className="field-error">Full name is required</div>
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
                    {...register("phone", { required: true, maxLength: 30 })}
                  />
                  {errors.phone && (
                    <div className="field-error">Phone is required</div>
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
              <label className="form-label-sm">Address Line 2 (Optional)</label>
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
                    {...register("city", { required: true, maxLength: 100 })}
                  />
                  {errors.city && (
                    <div className="field-error">City is required</div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label-sm">State (Optional)</label>
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
                    <div className="field-error">Postal code is required</div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label-sm">Country Code</label>
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

            {/* Default Checkbox */}
            <div className="default-check">
              <label className="check-label">
                <input type="checkbox" {...register("isDefault")} />
                <span>Set as default shipping address</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-outline-cust" onClick={close}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold-cust d-flex align-items-center gap-2"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                />
              ) : (
                <i className="bi bi-check2" />
              )}
              {isEditMode ? "Save Changes" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

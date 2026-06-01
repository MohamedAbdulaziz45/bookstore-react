import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { ToastService } from "../../services/toast.service";
import { ApiAddressService } from "../../services/addresses/api-address.service";
import { ApiCheckoutService } from "../../services/checkout/api-checkout.service";
import { IAddress } from "../../models/Address/iaddress";
import { ICreateAddressRequest } from "../../models/Address/icreate-address-request";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { AddressFormModalComponent } from "../../components/address-form-modal/address-form-modal.component";

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    AddressFormModalComponent,
  ],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.scss",
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  private toastService = inject(ToastService);
  private addressService = inject(ApiAddressService);
  private checkoutService = inject(ApiCheckoutService);
  private fb = inject(FormBuilder);

  // State
  addresses: IAddress[] = [];
  selectedAddressId: number | null = null;
  isLoadingAddresses = true;
  isProcessing = false;
  showAddressModal = false;

  // Inline form for when user has zero addresses
  inlineAddressForm: FormGroup;

  constructor() {
    this.inlineAddressForm = this.fb.group({
      label: ["Home", [Validators.required, Validators.maxLength(50)]],
      fullName: ["", [Validators.required, Validators.maxLength(150)]],
      phone: ["", [Validators.required, Validators.maxLength(30)]],
      addressLine1: ["", [Validators.required, Validators.maxLength(250)]],
      addressLine2: ["", [Validators.maxLength(250)]],
      city: ["", [Validators.required, Validators.maxLength(100)]],
      state: ["", [Validators.maxLength(100)]],
      postalCode: ["", [Validators.required, Validators.maxLength(20)]],
      country: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      isDefault: [true],
    });
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoadingAddresses = true;
    this.addressService.getMyAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        // Auto-select the default address, or the first one
        const defaultAddr = addresses.find((a) => a.isDefault);
        this.selectedAddressId = defaultAddr
          ? defaultAddr.addressId
          : addresses.length > 0
            ? addresses[0].addressId
            : null;
        this.isLoadingAddresses = false;
      },
      error: () => {
        this.toastService.show("Failed to load addresses", "error");
        this.isLoadingAddresses = false;
      },
    });
  }

  selectAddress(addressId: number): void {
    this.selectedAddressId = addressId;
  }

  /** Called when the modal saves a new address */
  onAddressSaved(address: IAddress): void {
    this.addresses.push(address);
    this.selectedAddressId = address.addressId;
    this.showAddressModal = false;
  }

  /** Save inline form (zero-addresses case), then proceed to Stripe */
  saveInlineAndCheckout(): void {
    if (this.inlineAddressForm.invalid) {
      this.inlineAddressForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    const formData: ICreateAddressRequest = this.inlineAddressForm.value;

    this.addressService.create(formData).subscribe({
      next: (result) => {
        const created: IAddress = {
          addressId: result.addressId,
          ...formData,
        };
        this.addresses.push(created);
        this.selectedAddressId = result.addressId;
        // Immediately proceed to Stripe
        this.payWithStripe();
      },
      error: () => {
        this.isProcessing = false;
        this.toastService.show("Failed to save address", "error");
      },
    });
  }

  /** Create Stripe checkout session and redirect */
  payWithStripe(): void {
    if (!this.selectedAddressId) {
      this.toastService.show("Please select a shipping address", "error");
      return;
    }

    this.isProcessing = true;
    this.checkoutService.createSession(this.selectedAddressId).subscribe({
      next: (result) => {
        window.location.href = result.sessionUrl;
      },
      error: (err) => {
        this.isProcessing = false;
        const msg =
          err.error?.message || "Failed to start checkout. Please try again.";
        this.toastService.show(msg, "error");
      },
    });
  }
}

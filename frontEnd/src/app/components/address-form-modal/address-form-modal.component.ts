import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { IAddress } from "../../models/Address/iaddress";
import { ICreateAddressRequest } from "../../models/Address/icreate-address-request";
import { ApiAddressService } from "../../services/addresses/api-address.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-address-form-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./address-form-modal.component.html",
  styleUrl: "./address-form-modal.component.scss",
})
export class AddressFormModalComponent implements OnInit {
  /** Pass an existing address to enter edit mode. Null = create mode. */
  @Input() address?: IAddress;

  /** When true, pre-fills label='Home' and isDefault=true (for first-ever address). */
  @Input() isFirstAddress = false;

  /** Whether the modal is visible. */
  @Input() isOpen = false;

  /** Emits the saved address (created or updated) so the parent can update its list. */
  @Output() saved = new EventEmitter<IAddress>();

  /** Emits when the modal is closed without saving. */
  @Output() closed = new EventEmitter<void>();

  addressForm: FormGroup;
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private addressService = inject(ApiAddressService);
  private toastService = inject(ToastService);

  get isEditMode(): boolean {
    return !!this.address;
  }

  constructor() {
    this.addressForm = this.fb.group({
      label: ["", [Validators.required, Validators.maxLength(50)]],
      fullName: ["", [Validators.required, Validators.maxLength(150)]],
      phone: ["", [Validators.required, Validators.maxLength(30)]],
      addressLine1: ["", [Validators.required, Validators.maxLength(250)]],
      addressLine2: ["", [Validators.maxLength(250)]],
      city: ["", [Validators.required, Validators.maxLength(100)]],
      state: ["", [Validators.maxLength(100)]],
      postalCode: ["", [Validators.required, Validators.maxLength(20)]],
      country: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2),
        ],
      ],
      isDefault: [false],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.address) {
      this.addressForm.patchValue(this.address);
    } else if (this.isFirstAddress) {
      this.addressForm.patchValue({ label: "Home", isDefault: true });
    }
  }

  onSubmit(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData: ICreateAddressRequest = this.addressForm.value;

    if (this.isEditMode && this.address) {
      this.addressService
        .update(this.address.addressId, formData)
        .subscribe({
          next: () => {
            const updated: IAddress = {
              ...this.address!,
              ...formData,
            };
            this.toastService.show("Address updated successfully", "success");
            this.saved.emit(updated);
            this.isSubmitting = false;
            this.close();
          },
          error: () => {
            this.toastService.show("Failed to update address", "error");
            this.isSubmitting = false;
          },
        });
    } else {
      this.addressService.create(formData).subscribe({
        next: (result) => {
          const created: IAddress = {
            addressId: result.addressId,
            ...formData,
          };
          this.toastService.show("Address saved successfully", "success");
          this.saved.emit(created);
          this.isSubmitting = false;
          this.close();
        },
        error: () => {
          this.toastService.show("Failed to save address", "error");
          this.isSubmitting = false;
        },
      });
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
    this.addressForm.reset();
  }

  /** Close when clicking the backdrop (not the modal content). */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains("modal-backdrop")) {
      this.close();
    }
  }
}

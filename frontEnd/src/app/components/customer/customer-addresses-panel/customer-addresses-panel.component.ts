import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiAddressService } from "../../../services/addresses/api-address.service";
import { ToastService } from "../../../services/toast.service";
import { IAddress } from "../../../models/Address/iaddress";
import { AddressFormModalComponent } from "../../address-form-modal/address-form-modal.component";

@Component({
  selector: "app-customer-addresses-panel",
  standalone: true,
  imports: [CommonModule, AddressFormModalComponent],
  templateUrl: "./customer-addresses-panel.component.html",
})
export class CustomerAddressesPanelComponent implements OnInit {
  @Output() addressCountChange = new EventEmitter<number>();

  private addressService = inject(ApiAddressService);
  private toastService = inject(ToastService);

  addresses: IAddress[] = [];
  isLoading = true;

  // Modal state
  showModal = false;
  editingAddress?: IAddress;

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.addressService.getMyAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.addressCountChange.emit(this.addresses.length);
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show("Failed to load addresses", "error");
        this.isLoading = false;
      },
    });
  }

  openAddModal(): void {
    this.editingAddress = undefined;
    this.showModal = true;
  }

  openEditModal(address: IAddress): void {
    this.editingAddress = address;
    this.showModal = true;
  }

  onAddressSaved(address: IAddress): void {
    this.showModal = false;
    this.editingAddress = undefined;
    this.loadAddresses();
  }

  onModalClosed(): void {
    this.showModal = false;
    this.editingAddress = undefined;
  }

  deleteAddress(address: IAddress): void {
    if (!confirm(`Remove "${address.label}" address?`)) {
      return;
    }

    this.addressService.delete(address.addressId).subscribe({
      next: () => {
        this.toastService.show("Address removed", "success");
        this.loadAddresses();
      },
      error: () => {
        this.toastService.show("Failed to remove address", "error");
      },
    });
  }

  setDefault(address: IAddress): void {
    this.addressService.setDefault(address.addressId).subscribe({
      next: () => {
        this.toastService.show(`"${address.label}" set as default`, "success");
        this.loadAddresses();
      },
      error: () => {
        this.toastService.show("Failed to set default address", "error");
      },
    });
  }
}

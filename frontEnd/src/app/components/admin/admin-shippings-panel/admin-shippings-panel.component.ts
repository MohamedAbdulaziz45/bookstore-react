import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  AdminShipping,
  AdminShippingFormValue,
} from "../../../models/admin/admin.models";
import { ApiShippingsService } from "../../../services/shippings/api-shippings.service";

@Component({
  selector: "app-admin-shippings-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-shippings-panel.component.html",
  styleUrl: "./admin-shippings-panel.component.scss",
})
export class AdminShippingsPanelComponent implements OnInit {
  shippings: AdminShipping[] = [];
  filteredShippings: AdminShipping[] = [];
  loading = false;
  error = "";
  search = "";
  isDrawerOpen = false;
  editingShipping: AdminShipping | null = null;
  form: AdminShippingFormValue = this.emptyForm();
  readonly statusOptions = [
    { label: "Pending", value: 0 },
    { label: "In Transit", value: 1 },
    { label: "Out For Delivery", value: 2 },
    { label: "Delivered", value: 3 },
    { label: "Failed", value: 4 },
    { label: "Returned", value: 5 },
  ];

  constructor(private shippingsService: ApiShippingsService) {}

  ngOnInit(): void {
    this.loadShippings();
  }

  loadShippings(): void {
    this.loading = true;
    this.error = "";
    this.shippingsService.getAllShippings().subscribe({
      next: (shippings) => {
        this.shippings = shippings;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load shippings.";
        this.loading = false;
      },
    });
  }

  applySearch(): void {
    const term = this.search.trim().toLowerCase();
    this.filteredShippings = term
      ? this.shippings.filter(
          (shipping) =>
            shipping.trackingNumber.toLowerCase().includes(term) ||
            shipping.carrierName.toLowerCase().includes(term) ||
            String(shipping.orderId).includes(term) ||
            (shipping.customer ?? "").toLowerCase().includes(term),
        )
      : [...this.shippings];
  }

  openCreate(): void {
    this.editingShipping = null;
    this.form = this.emptyForm();
    this.isDrawerOpen = true;
  }

  openEdit(shipping: AdminShipping): void {
    this.editingShipping = shipping;
    this.form = {
      carrierName: shipping.carrierName,
      trackingNumber: shipping.trackingNumber,
      shippingStatus: this.statusValue(shipping.shippingStatus),
      estimatedDeliveryDate: shipping.estimatedDeliveryDate.slice(0, 10),
      actualDeliveryDate: shipping.actualDeliveryDate?.slice(0, 10) ?? null,
      orderId: shipping.orderId,
    };
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  submit(): void {
    if (
      !this.form.carrierName.trim() ||
      !this.form.trackingNumber.trim() ||
      !this.form.estimatedDeliveryDate ||
      this.form.orderId <= 0
    ) {
      this.error = "Carrier, tracking number, order, and estimated delivery are required.";
      return;
    }

    const save$ = this.editingShipping
      ? this.shippingsService.updateShipping(
          this.editingShipping.shippingId,
          this.form,
        )
      : this.shippingsService.createShipping(this.form);

    this.loading = true;
    save$.subscribe({
      next: () => {
        this.isDrawerOpen = false;
        this.loadShippings();
      },
      error: () => {
        this.error = "Could not save shipping.";
        this.loading = false;
      },
    });
  }

  statusLabel(status: string | number): string {
    const value = this.statusValue(status);
    return this.statusOptions.find((option) => option.value === value)?.label ?? "Pending";
  }

  statusValue(status: string | number): number {
    if (typeof status === "number") return status;
    const normalized = status.replace(/\s+/g, "").toLowerCase();
    return (
      this.statusOptions.find(
        (option) =>
          option.label.replace(/\s+/g, "").toLowerCase() === normalized,
      )?.value ?? 0
    );
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
  }

  private emptyForm(): AdminShippingFormValue {
    return {
      carrierName: "",
      trackingNumber: "",
      shippingStatus: 0,
      estimatedDeliveryDate: new Date().toISOString().slice(0, 10),
      actualDeliveryDate: null,
      orderId: 0,
    };
  }
}

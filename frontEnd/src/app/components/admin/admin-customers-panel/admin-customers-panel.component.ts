import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AdminCustomer } from "../../../models/admin/admin.models";
import { ApiCustomersService } from "../../../services/customers/api-customers.service";

@Component({
  selector: "app-admin-customers-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-customers-panel.component.html",
  styleUrl: "./admin-customers-panel.component.scss",
})
export class AdminCustomersPanelComponent implements OnInit {
  customers: AdminCustomer[] = [];
  filteredCustomers: AdminCustomer[] = [];
  loading = false;
  error = "";
  search = "";
  selectedCustomer: AdminCustomer | null = null;

  constructor(private customersService: ApiCustomersService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = "";
    this.customersService.getAllCustomers(undefined, 100).subscribe({
      next: (page) => {
        this.customers = page.items;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load customers.";
        this.loading = false;
      },
    });
  }

  applySearch(): void {
    const term = this.search.trim().toLowerCase();
    this.filteredCustomers = term
      ? this.customers.filter(
          (customer) =>
            customer.displayName.toLowerCase().includes(term) ||
            customer.email.toLowerCase().includes(term) ||
            (customer.phone ?? "").toLowerCase().includes(term),
        )
      : [...this.customers];
  }

  viewCustomer(customer: AdminCustomer): void {
    this.selectedCustomer = customer;
  }

  closeView(): void {
    this.selectedCustomer = null;
  }

  deactivate(customer: AdminCustomer): void {
    if (customer.isDeleted) return;
    if (!confirm(`Deactivate customer "${customer.displayName}"?`)) return;

    this.loading = true;
    this.customersService.deactivateCustomer(customer.customerId).subscribe({
      next: () => {
        this.selectedCustomer = null;
        this.loadCustomers();
      },
      error: () => {
        this.error = "Could not deactivate customer.";
        this.loading = false;
      },
    });
  }

  initials(customer: AdminCustomer): string {
    return customer.displayName.slice(0, 2).toUpperCase();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
  }
}

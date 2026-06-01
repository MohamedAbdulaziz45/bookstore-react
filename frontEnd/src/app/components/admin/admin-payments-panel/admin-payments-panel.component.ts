import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AdminPayment } from "../../../models/admin/admin.models";
import { ApiPaymentsService } from "../../../services/payments/api-payments.service";

@Component({
  selector: "app-admin-payments-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-payments-panel.component.html",
  styleUrl: "./admin-payments-panel.component.scss",
})
export class AdminPaymentsPanelComponent implements OnInit {
  payments: AdminPayment[] = [];
  filteredPayments: AdminPayment[] = [];
  loading = false;
  error = "";
  search = "";
  selectedPayment: AdminPayment | null = null;

  constructor(private paymentsService: ApiPaymentsService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.error = "";
    this.paymentsService.getAllPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load payments.";
        this.loading = false;
      },
    });
  }

  applySearch(): void {
    const term = this.search.trim().toLowerCase();
    this.filteredPayments = term
      ? this.payments.filter(
          (payment) =>
            String(payment.paymentId).includes(term) ||
            String(payment.orderId).includes(term) ||
            (payment.customer ?? "").toLowerCase().includes(term),
        )
      : [...this.payments];
  }

  viewPayment(payment: AdminPayment): void {
    this.selectedPayment = payment;
  }

  closeView(): void {
    this.selectedPayment = null;
  }

  totalCollected(): number {
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  }

  formatCurrency(value: number, currency = "USD"): string {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase() === "EGP" ? "EGP" : "USD",
    }).format(value);
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
  }
}

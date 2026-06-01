import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AdminOrder } from "../../../models/admin/admin.models";
import { OrderStatus } from "../../../models/Orders/order-status";
import { ApiOrdersService } from "../../../services/orders/api-orders.service";

@Component({
  selector: "app-admin-orders-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-orders-panel.component.html",
  styleUrl: "./admin-orders-panel.component.scss",
})
export class AdminOrdersPanelComponent implements OnInit {
  orders: AdminOrder[] = [];
  filteredOrders: AdminOrder[] = [];
  loading = false;
  error = "";
  search = "";
  selectedOrder: AdminOrder | null = null;
  readonly statusMap: Record<OrderStatus, number> = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 3,
    Cancelled: 4,
  };

  constructor(private ordersService: ApiOrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = "";
    this.ordersService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load orders.";
        this.loading = false;
      },
    });
  }

  applySearch(): void {
    const term = this.search.trim().toLowerCase();
    this.filteredOrders = term
      ? this.orders.filter(
          (order) =>
            String(order.orderId).includes(term) ||
            (order.customerName ?? "").toLowerCase().includes(term),
        )
      : [...this.orders];
  }

  statusLabel(order: AdminOrder): OrderStatus {
    if (typeof order.status === "number") {
      return (Object.keys(this.statusMap) as OrderStatus[]).find(
        (status) => this.statusMap[status] === order.status,
      ) ?? "Pending";
    }
    return order.status;
  }

  nextActions(order: AdminOrder): { label: string; status: OrderStatus }[] {
    switch (this.statusLabel(order)) {
      case "Pending":
        return [
          { label: "Processing", status: "Processing" },
          { label: "Cancel", status: "Cancelled" },
        ];
      case "Processing":
        return [
          { label: "Shipped", status: "Shipped" },
          { label: "Cancel", status: "Cancelled" },
        ];
      case "Shipped":
        return [{ label: "Delivered", status: "Delivered" }];
      default:
        return [];
    }
  }

  changeStatus(order: AdminOrder, status: OrderStatus): void {
    this.loading = true;
    this.error = "";
    this.ordersService
      .updateOrderStatus(order.orderId, this.statusMap[status])
      .subscribe({
        next: () => this.loadOrders(),
        error: () => {
          this.error = "Could not update order status.";
          this.loading = false;
        },
      });
  }

  viewOrder(order: AdminOrder): void {
    this.selectedOrder = order;
  }

  closeView(): void {
    this.selectedOrder = null;
  }

  statusClass(order: AdminOrder): string {
    return this.statusLabel(order).toLowerCase();
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

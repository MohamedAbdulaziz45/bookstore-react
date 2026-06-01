import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { ApiOrdersService } from "../../../services/orders/api-orders.service";
import { ToastService } from "../../../services/toast.service";
import { Order } from "../../../models/Orders/order";

@Component({
  selector: "app-customer-orders-panel",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./customer-orders-panel.component.html",
})
export class CustomerOrdersPanelComponent implements OnInit {
  private ordersService = inject(ApiOrdersService);
  private toastService = inject(ToastService);

  orders: Order[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.ordersService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show("Failed to load orders", "error");
      },
    });
  }

  cancel(order: Order): void {
    if (order.status !== "Pending") {
      this.toastService.show("Only pending orders can be cancelled", "info");
      return;
    }

    if (!confirm(`Cancel order #${order.orderId}?`)) return;

    this.ordersService.cancelOrder(order.orderId).subscribe({
      next: () => {
        this.toastService.show("Order cancelled", "success");
        this.load();
      },
      error: (err) => {
        const msg =
          err?.error?.message || "Failed to cancel order. Please try again.";
        this.toastService.show(msg, "error");
      },
    });
  }
}

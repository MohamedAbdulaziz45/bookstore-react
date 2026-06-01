import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ApiOrdersService } from "../../services/orders/api-orders.service";
import { ToastService } from "../../services/toast.service";
import { Order } from "../../models/Orders/order";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: "app-checkout-success",
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>

    <section class="section-py bg-brand">
      <div class="container">
        <div class="card p-4 border-0 shadow-sm">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div
              class="rounded-circle d-inline-flex align-items-center justify-content-center"
              style="width: 44px; height: 44px; background:#e9f7ef; color:#198754; font-weight:800;"
            >
              ✓
            </div>
            <div>
              <h2 class="mb-1" style="font-size:1.25rem">Payment successful</h2>
              <div class="text-muted" style="font-size:.9rem">
                We’re confirming your order details.
              </div>
            </div>
          </div>

          <div *ngIf="isLoading" class="py-4 text-center">
            <div class="spinner-border text-gold" role="status"></div>
            <div class="text-muted mt-3">Loading your order...</div>
          </div>

          <div *ngIf="!isLoading && errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <div *ngIf="!isLoading && order" class="mt-3">
            <div class="row g-3">
              <div class="col-lg-7">
                <div class="p-3 rounded" style="background:#fff7ec;">
                  <div
                    class="d-flex justify-content-between align-items-start gap-3"
                  >
                    <div>
                      <div class="text-muted" style="font-size:.85rem">
                        Order
                      </div>
                      <div style="font-weight:800; font-size:1.05rem">
                        #{{ order.orderId }}
                      </div>
                    </div>
                    <span class="badge text-bg-light border">
                      {{ order.status }}
                    </span>
                  </div>

                  <hr />

                  <div class="row g-2">
                    <div class="col-md-6">
                      <div class="text-muted" style="font-size:.85rem">
                        Total
                      </div>
                      <div style="font-weight:800">
                        {{ order.totalAmount.toFixed(2) }} EGP
                      </div>
                    </div>
                    <div class="col-md-6" *ngIf="order.payment">
                      <div class="text-muted" style="font-size:.85rem">
                        Payment
                      </div>
                      <div style="font-weight:800">
                        {{ order.payment.paymentMethod }} ·
                        {{ order.payment.amount.toFixed(2) }}
                        {{ order.payment.currency?.toUpperCase() }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-3" *ngIf="order.shippingAddress?.addressLine1">
                    <div class="text-muted" style="font-size:.85rem">
                      Shipping
                    </div>
                    <div style="font-weight:700">
                      {{ order.shippingAddress.recipientName }}
                    </div>
                    <div class="text-muted">
                      {{ order.shippingAddress.addressLine1 }}
                      <span *ngIf="order.shippingAddress.addressLine2"
                        >, {{ order.shippingAddress.addressLine2 }}</span
                      >
                      <br />
                      {{ order.shippingAddress.city }}
                      <span *ngIf="order.shippingAddress.state"
                        >, {{ order.shippingAddress.state }}</span
                      >
                      {{ order.shippingAddress.postalCode }}
                      <br />
                      {{ order.shippingAddress.country }}
                    </div>
                  </div>
                </div>

                <div class="mt-3">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <h3 class="mb-0" style="font-size:1rem">Items</h3>
                    <div class="text-muted" style="font-size:.85rem">
                      {{ order.orderItems.length }} item(s)
                    </div>
                  </div>
                  <div class="mt-2">
                    <div
                      *ngFor="let item of order.orderItems"
                      class="d-flex justify-content-between align-items-center py-2 border-bottom"
                    >
                      <div>
                        <div style="font-weight:700">
                          Book #{{ item.bookId }}
                        </div>
                        <div class="text-muted" style="font-size:.85rem">
                          Qty {{ item.quantity }} ·
                          {{ item.price.toFixed(2) }} EGP
                        </div>
                      </div>
                      <div style="font-weight:800">
                        {{ item.totalItemsPrice.toFixed(2) }} EGP
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-5">
                <div class="p-3 rounded border">
                  <div style="font-weight:800" class="mb-2">Next steps</div>
                  <ul class="mb-3" style="padding-left:1.1rem">
                    <li>We’ll email your receipt and order confirmation.</li>
                    <li>You can track the order status in your account.</li>
                  </ul>

                  <div class="d-flex flex-column gap-2">
                    <a
                      class="btn btn-dark"
                      [routerLink]="['/my-account']"
                      [queryParams]="{ tab: 'orders' }"
                    >
                      Go to My Orders
                    </a>
                    <a
                      class="btn btn-outline-dark"
                      [routerLink]="['/orders', order.orderId]"
                    >
                      View order details
                    </a>
                    <a class="btn btn-outline-secondary" [routerLink]="['/']">
                      Continue shopping
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ordersService = inject(ApiOrdersService);
  private toastService = inject(ToastService);

  isLoading = true;
  errorMessage = "";
  order: Order | null = null;

  ngOnInit(): void {
    const sessionId =
      this.route.snapshot.queryParamMap.get("session_id") ||
      this.route.snapshot.queryParamMap.get("sessionId") ||
      "";

    if (!sessionId) {
      this.isLoading = false;
      this.errorMessage = "Missing Stripe session id in the URL.";
      return;
    }

    this.ordersService.getBySessionId(sessionId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage =
          "We couldn't load your order details yet. Please check My Orders in a moment.";
        this.toastService.show("Failed to load order by session id", "error");
      },
    });
  }
  private pollOrder(
    sessionId: string,
    retriesLeft: number,
    delayMs: number,
  ): void {
    this.ordersService.getBySessionId(sessionId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: () => {
        if (retriesLeft > 0) {
          setTimeout(
            () => this.pollOrder(sessionId, retriesLeft - 1, delayMs),
            delayMs,
          );
        } else {
          this.isLoading = false;
          this.errorMessage =
            "We couldn't load your order details yet. Please check My Orders in a moment.";
          this.toastService.show("Failed to load order by session id", "error");
        }
      },
    });
  }
}

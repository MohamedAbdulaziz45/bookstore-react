import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { OrderTimelineComponent } from "./components/order-timeline.component";
import { OrderItemsComponent } from "./components/order-items.component";
import { BooksService } from "../../services/books.service";

@Component({
  selector: "app-order-tracking",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    OrderTimelineComponent,
    OrderItemsComponent,
  ],
  template: `
    <app-header></app-header>
    <app-page-banner
      title="Order Details & Tracking"
      subtitle="A full order page with shipment status, purchased items, and next-step reassurance."
    ></app-page-banner>

    <section class="section-py bg-brand">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-7">
            <app-order-items [orderId]="orderId" status="In transit" [books]="orderedBooks"></app-order-items>
          </div>
          <div class="col-lg-5">
            <app-order-timeline [steps]="steps"></app-order-timeline>
          </div>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
})
export class OrderTrackingComponent {
  private route = inject(ActivatedRoute);
  private booksService = inject(BooksService);

  orderId = this.route.snapshot.paramMap.get("id") || "BW-10248";
  orderedBooks = this.booksService.getAll().slice(0, 3);

  steps = [
    { label: "Order confirmed", detail: "Payment accepted and picking list generated for the warehouse.", active: true },
    { label: "Packed for dispatch", detail: "Books were packed with protective wrap and labeled for courier pickup.", active: true },
    { label: "In transit", detail: "Package is moving between sorting hubs and is expected within 2 business days.", active: true },
    { label: "Delivered", detail: "Final doorstep confirmation will appear here once the courier completes the route.", active: false },
  ];
}

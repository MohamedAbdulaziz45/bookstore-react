import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { DealsHeroStripComponent } from "./components/deals-hero-strip.component";
import { DealsCollectionComponent } from "./components/deals-collection.component";
import { BooksService } from "../../services/books.service";

@Component({
  selector: "app-deals",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    DealsHeroStripComponent,
    DealsCollectionComponent,
  ],
  template: `
    <app-header></app-header>
    <app-page-banner
      title="Deals & Featured Collections"
      subtitle="A place for promotions, curated campaigns, and shelves that feel more merchandised."
    ></app-page-banner>

    <section class="section-py bg-brand">
      <div class="container">
        <app-deals-hero-strip [panels]="panels"></app-deals-hero-strip>
        <app-deals-collection label="Price Break" title="Under $18 picks" [books]="underEighteen"></app-deals-collection>
        <app-deals-collection label="Momentum Shelf" title="Best sellers with promo framing" [books]="bestSellerDeals"></app-deals-collection>
      </div>
    </section>

    <app-footer></app-footer>
  `,
})
export class DealsComponent {
  private books = inject(BooksService).getAll();

  panels = [
    {
      label: "Bundle Week",
      title: "Buy 2, build the reading stack faster",
      note: "A promotional slot for paired recommendations, seasonal bundles, or cart threshold offers.",
      tone: "linear-gradient(135deg, #f6d2b9 0%, #edb98c 100%)",
    },
    {
      label: "Staff Table",
      title: "Books with strong hand-sell energy",
      note: "Great for editor picks, club reads, or monthly themes that deserve more visual weight.",
      tone: "linear-gradient(135deg, #dce8de 0%, #b8d0c0 100%)",
    },
    {
      label: "Weekend Push",
      title: "Campaign-ready placement for urgent offers",
      note: "Useful for limited stock, flash discounts, or timely seasonal promotions.",
      tone: "linear-gradient(135deg, #f3e0d5 0%, #ddbea9 100%)",
    },
  ];

  underEighteen = this.books.filter((book) => book.price < 18).slice(0, 4);
  bestSellerDeals = this.books.filter((book) => book.category?.includes("best-seller")).slice(0, 4);
}

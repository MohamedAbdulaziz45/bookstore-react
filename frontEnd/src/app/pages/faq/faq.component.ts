import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { HelpTopicsComponent } from "./components/help-topics.component";
import { FaqListComponent } from "./components/faq-list.component";

@Component({
  selector: "app-faq",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    HelpTopicsComponent,
    FaqListComponent,
  ],
  template: `
    <app-header></app-header>
    <app-page-banner
      title="FAQ & Help Center"
      subtitle="Support content that makes the storefront feel complete, trustworthy, and easier to buy from."
    ></app-page-banner>

    <section class="section-py bg-brand">
      <div class="container">
        <app-help-topics [topics]="topics"></app-help-topics>
        <app-faq-list [items]="faqs"></app-faq-list>
      </div>
    </section>

    <app-footer></app-footer>
  `,
})
export class FaqComponent {
  topics = [
    { label: "Orders", title: "Shipping and tracking", note: "Delivery windows, courier status, and dispatch timing." },
    { label: "Payments", title: "Billing help", note: "Accepted methods, charges, and order confirmation behavior." },
    { label: "Returns", title: "Refund support", note: "Damaged books, return windows, and replacement requests." },
  ];

  faqs = [
    {
      question: "How long does shipping usually take?",
      answer: "Standard orders usually dispatch within 1 to 2 business days, with delivery timing depending on your shipping address and selected service level.",
    },
    {
      question: "Can I cancel an order after placing it?",
      answer: "You can usually cancel before the order enters packing. Once packed or handed to the courier, cancellation becomes a return request instead.",
    },
    {
      question: "What if a book arrives damaged?",
      answer: "This page is now ready for the real refund and replacement workflow to be connected once your service layer is in place.",
    },
    {
      question: "Do you support guest checkout?",
      answer: "That flow is a logical next step for this storefront. The page structure now leaves room for it cleanly.",
    },
  ];
}

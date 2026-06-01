import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-wishlist-summary",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="summary-wrap">
      @for (item of stats; track item.label) {
        <div class="stat-card">
          <p>{{ item.label }}</p>
          <h3>{{ item.value }}</h3>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .summary-wrap {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
      }
      .stat-card {
        background: linear-gradient(135deg, #fff8ef 0%, #f3e6d4 100%);
        border-radius: 22px;
        padding: 1.4rem;
        border: 1px solid rgba(199, 139, 81, 0.14);
      }
      p {
        margin: 0 0 0.45rem;
        color: var(--brand-gray);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.74rem;
      }
      h3 {
        margin: 0;
        color: var(--brand-dark);
        font-family: "Lato", sans-serif;
      }
      @media (max-width: 767px) {
        .summary-wrap { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class WishlistSummaryComponent {
  @Input() stats: { label: string; value: string }[] = [];
}

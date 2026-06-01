import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Book } from "../../../models/book.model";

@Component({
  selector: "app-order-items",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="items-card">
      <div class="head">
        <div>
          <p class="eyebrow">Order Items</p>
          <h3>{{ orderId }}</h3>
        </div>
        <span class="status">{{ status }}</span>
      </div>

      @for (book of books; track book.id) {
        <div class="item-row">
          <img [src]="book.image" [alt]="book.title" loading="lazy" />
          <div>
            <h4>{{ book.title }}</h4>
            <p>{{ book.author }}</p>
          </div>
          <strong>\${{ book.price.toFixed(2) }}</strong>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .items-card {
        background: linear-gradient(135deg, #fff8ef 0%, #f4e6d4 100%);
        border-radius: 22px;
        padding: 1.5rem;
        border: 1px solid rgba(199, 139, 81, 0.14);
      }
      .head {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: start;
        margin-bottom: 1rem;
      }
      .eyebrow {
        margin: 0 0 0.35rem;
        text-transform: uppercase;
        font-size: 0.74rem;
        letter-spacing: 0.14em;
        color: #8f623a;
      }
      h3 {
        margin: 0;
        color: var(--brand-dark);
        font-family: "Lato", sans-serif;
      }
      .status {
        background: #fff;
        border-radius: 999px;
        padding: 0.45rem 0.8rem;
        color: #8f623a;
        font-weight: 700;
      }
      .item-row {
        display: grid;
        grid-template-columns: 72px 1fr auto;
        align-items: center;
        gap: 0.9rem;
        padding: 0.8rem 0;
        border-top: 1px solid rgba(199, 139, 81, 0.12);
      }
      img {
        width: 72px;
        height: 88px;
        object-fit: cover;
        border-radius: 12px;
      }
      h4 {
        margin: 0 0 0.25rem;
        color: var(--brand-dark);
      }
      p {
        margin: 0;
        color: var(--brand-gray);
      }
      strong { color: #c78b51; }
    `,
  ],
})
export class OrderItemsComponent {
  @Input() orderId = "";
  @Input() status = "";
  @Input() books: Book[] = [];
}

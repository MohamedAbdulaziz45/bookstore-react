import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-faq-list",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-list">
      @for (item of items; track item.question) {
        <details class="faq-item" [open]="$index === 0">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      }
    </div>
  `,
  styles: [
    `
      .faq-list {
        display: grid;
        gap: 1rem;
      }
      .faq-item {
        background: #fff;
        border-radius: 20px;
        padding: 1rem 1.15rem;
        border: 1px solid rgba(199, 139, 81, 0.12);
        box-shadow: 0 10px 28px rgba(34, 25, 15, 0.05);
      }
      summary {
        cursor: pointer;
        list-style: none;
        font-weight: 700;
        color: var(--brand-dark);
      }
      summary::-webkit-details-marker { display: none; }
      p {
        margin: 0.85rem 0 0;
        color: var(--brand-gray);
        line-height: 1.7;
      }
    `,
  ],
})
export class FaqListComponent {
  @Input() items: { question: string; answer: string }[] = [];
}

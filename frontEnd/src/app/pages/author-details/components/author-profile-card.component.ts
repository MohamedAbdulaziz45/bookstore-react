import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-author-profile-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="author-card">
      <div class="author-header">
        @if (image) {
          <img [src]="image" [alt]="name" class="author-img" />
        }
        <div>
          <p class="eyebrow">Author Details</p>
          <h2>{{ name }}</h2>
        </div>
      </div>
      <p class="bio">{{ bio }}</p>

      <div class="stats">
        @for (stat of stats; track stat.label) {
          <div>
            <span>{{ stat.label }}</span>
            <strong>{{ stat.value }}</strong>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .author-card {
        border-radius: 24px;
        padding: 2rem;
        background: linear-gradient(135deg, #fff7ed 0%, #f0e0cd 100%);
        border: 1px solid rgba(199, 139, 81, 0.16);
        box-shadow: 0 16px 40px rgba(34, 25, 15, 0.08);
      }
      .eyebrow {
        margin: 0 0 0.4rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.74rem;
        color: #8f623a;
      }
      h2 {
        margin: 0 0 0.8rem;
        color: var(--brand-dark);
        font-family: "Lato", sans-serif;
        font-size: clamp(1.8rem, 3vw, 2.6rem);
      }
      .bio {
        color: var(--brand-gray);
        line-height: 1.75;
        max-width: 760px;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
      }
      .stats div {
        background: rgba(255, 255, 255, 0.7);
        border-radius: 18px;
        padding: 1rem;
      }
      span {
        display: block;
        color: var(--brand-gray);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.35rem;
      }
      strong {
        color: var(--brand-dark);
        font-size: 1.1rem;
      }
      @media (max-width: 767px) {
        .stats {
          grid-template-columns: 1fr;
        }
      }
      .author-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 1rem;
      }
      .author-img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid rgba(199, 139, 81, 0.3);
        flex-shrink: 0;
      }
    `,
  ],
})
export class AuthorProfileCardComponent {
  @Input() name = "";
  @Input() bio = "";
  @Input() stats: { label: string; value: string }[] = [];
  @Input() image: string | null = null;
}

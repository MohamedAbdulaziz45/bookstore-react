import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-genre-hero",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="genre-hero">
      <div class="hero-shell">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p class="copy">{{ subtitle }}</p>
      </div>
    </section>
  `,
  styles: [
    `
      .genre-hero { padding: 0 0 2rem; }
      .hero-shell {
        background: linear-gradient(135deg, #f7efe5 0%, #fffaf4 55%, #f2e2cb 100%);
        border: 1px solid rgba(199, 139, 81, 0.18);
        border-radius: 24px;
        padding: 2.25rem;
        box-shadow: 0 16px 50px rgba(70, 45, 18, 0.08);
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.74rem;
        color: #8f623a;
        margin-bottom: 0.85rem;
      }
      h2 {
        margin: 0 0 0.85rem;
        font-size: clamp(1.8rem, 3vw, 2.7rem);
        color: var(--brand-dark);
        font-family: "Lato", sans-serif;
      }
      .copy {
        max-width: 720px;
        margin: 0;
        color: var(--brand-gray);
        line-height: 1.7;
      }
    `,
  ],
})
export class GenreHeroComponent {
  @Input() eyebrow = "";
  @Input() title = "";
  @Input() subtitle = "";
}

import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-deals-hero-strip",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="deal-strip">
      <div class="row g-4 align-items-stretch">
        @for (panel of panels; track panel.title) {
          <div class="col-md-4">
            <div class="deal-card h-100" [style.background]="panel.tone">
              <p>{{ panel.label }}</p>
              <h3>{{ panel.title }}</h3>
              <span>{{ panel.note }}</span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .deal-strip { margin-bottom: 1.5rem; }
      .deal-card {
        border-radius: 22px;
        padding: 1.4rem;
        color: #2f2418;
        min-height: 220px;
        box-shadow: 0 16px 36px rgba(34, 25, 15, 0.08);
      }
      p {
        margin: 0 0 0.4rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.74rem;
      }
      h3 {
        margin: 0 0 0.6rem;
        font-family: "Lato", sans-serif;
      }
      span {
        display: block;
        line-height: 1.65;
      }
    `,
  ],
})
export class DealsHeroStripComponent {
  @Input() panels: { label: string; title: string; note: string; tone: string }[] = [];
}

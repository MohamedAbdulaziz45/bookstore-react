import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-order-timeline",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline-card">
      <p class="eyebrow">Tracking Timeline</p>
      @for (step of steps; track step.label) {
        <div class="step-row">
          <div class="marker" [class.active]="step.active"></div>
          <div>
            <h4>{{ step.label }}</h4>
            <p>{{ step.detail }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .timeline-card {
        background: #fff;
        border-radius: 22px;
        padding: 1.5rem;
        border: 1px solid rgba(199, 139, 81, 0.12);
        box-shadow: 0 14px 35px rgba(34, 25, 15, 0.06);
      }
      .eyebrow {
        text-transform: uppercase;
        font-size: 0.74rem;
        letter-spacing: 0.15em;
        color: #8f623a;
        margin-bottom: 1rem;
      }
      .step-row {
        display: grid;
        grid-template-columns: 22px 1fr;
        gap: 0.9rem;
        padding: 0.75rem 0;
      }
      .marker {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #e6d5bf;
        margin-top: 0.45rem;
        box-shadow: 0 0 0 6px rgba(199, 139, 81, 0.12);
      }
      .marker.active { background: #c78b51; }
      h4 {
        margin: 0 0 0.25rem;
        color: var(--brand-dark);
      }
      p {
        margin: 0;
        color: var(--brand-gray);
      }
    `,
  ],
})
export class OrderTimelineComponent {
  @Input() steps: { label: string; detail: string; active: boolean }[] = [];
}

import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-help-topics",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="topic-grid">
      @for (topic of topics; track topic.title) {
        <div class="topic-card">
          <p>{{ topic.label }}</p>
          <h3>{{ topic.title }}</h3>
          <span>{{ topic.note }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .topic-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .topic-card {
        background: #fff;
        border-radius: 20px;
        padding: 1.25rem;
        border: 1px solid rgba(199, 139, 81, 0.12);
      }
      p {
        margin: 0 0 0.4rem;
        text-transform: uppercase;
        font-size: 0.74rem;
        color: #8f623a;
        letter-spacing: 0.12em;
      }
      h3 {
        margin: 0 0 0.45rem;
        color: var(--brand-dark);
        font-size: 1.08rem;
      }
      span { color: var(--brand-gray); }
      @media (max-width: 767px) {
        .topic-grid { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class HelpTopicsComponent {
  @Input() topics: { label: string; title: string; note: string }[] = [];
}

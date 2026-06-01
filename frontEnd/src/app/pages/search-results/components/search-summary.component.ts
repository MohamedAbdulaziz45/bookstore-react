import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-search-summary",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="summary-card">
      <div>
        <p class="eyebrow">Search Focus</p>
        <h3>"{{ query || "All books" }}"</h3>
        <p class="copy">
          {{ resultsCount }} matching books across title and author.
        </p>
      </div>

      <div class="controls">
        <input
          class="form-control"
          [(ngModel)]="draftQuery"
          (keyup.enter)="submitSearch()"
          placeholder="Refine search..."
        />
        <select
          class="form-select"
          [(ngModel)]="sort"
          (change)="sortChange.emit(sort)"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title">Title</option>
        </select>
        <button class="btn btn-gold" (click)="submitSearch()">Apply</button>
      </div>
    </div>
  `,
  styles: [
    `
      .summary-card {
        background: linear-gradient(135deg, #fff8ef 0%, #f3e7d7 100%);
        border: 1px solid rgba(199, 139, 81, 0.18);
        border-radius: 22px;
        padding: 1.5rem;
        display: grid;
        gap: 1.2rem;
      }
      .eyebrow {
        margin: 0 0 0.35rem;
        text-transform: uppercase;
        font-size: 0.74rem;
        letter-spacing: 0.14em;
        color: #8f623a;
      }
      h3 {
        margin: 0 0 0.45rem;
        color: var(--brand-dark);
        font-family: "Lato", sans-serif;
      }
      .copy {
        margin: 0;
        color: var(--brand-gray);
      }
      .controls {
        display: grid;
        grid-template-columns: 1.7fr 1fr auto;
        gap: 0.75rem;
      }
      @media (max-width: 767px) {
        .controls {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SearchSummaryComponent implements OnChanges {
  @Input() query = "";
  @Input() resultsCount = 0;
  @Input() sort = "featured";
  @Output() search = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  draftQuery = "";

  ngOnChanges(changes: SimpleChanges) {
    if (changes["query"]) {
      this.draftQuery = this.query;
    }
  }

  submitSearch() {
    this.search.emit(this.draftQuery.trim());
  }
}

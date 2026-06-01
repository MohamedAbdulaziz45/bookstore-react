import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Book } from "../../../models/book.model";
import { IBookSummary } from "../../../models/Book/i-book-summary";
import { BookGridComponent } from "../../../components/book-grid/book-grid.component";

@Component({
  selector: "app-genre-shelf",
  standalone: true,
  imports: [CommonModule, RouterLink, BookGridComponent],
  template: `
    <section class="shelf-wrap">
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ eyebrow }}</p>
          <h3>{{ title }}</h3>
          <span *ngIf="isFallBack" class="badge bg-warning text-dark fs-6"
            >Showing fallback data</span
          >
        </div>
        <a [routerLink]="ctaLink" class="browse-link">{{ ctaLabel }}</a>
      </div>

      <app-book-grid [books]="books" [showViewMore]="false"></app-book-grid>
    </section>
  `,
  styles: [
    `
      .shelf-wrap {
        padding-top: 1rem;
      }
      .section-head {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 1rem;
        margin-bottom: 1.4rem;
      }
      .eyebrow {
        margin: 0 0 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.78rem;
        color: #8f623a;
      }
      h3 {
        margin: 0;
        color: var(--brand-dark);
        font-family: "Lato", sans-serif;
      }
      .browse-link {
        color: #c78b51;
        font-weight: 700;
      }
    `,
  ],
})
export class GenreShelfComponent {
  @Input() eyebrow = "";
  @Input() title = "";
  @Input() isFallBack? = false;
  @Input() books: Book[] | IBookSummary[] = [];
  @Input() ctaLabel = "See all";
  @Input() ctaLink = "/all-books";
}

import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Book } from "../../../models/book.model";
import { BookGridComponent } from "../../../components/book-grid/book-grid.component";

@Component({
  selector: "app-deals-collection",
  standalone: true,
  imports: [CommonModule, BookGridComponent],
  template: `
    <section class="collection-wrap">
      <div class="head">
        <div>
          <p>{{ label }}</p>
          <h3>{{ title }}</h3>
        </div>
      </div>

      <app-book-grid [books]="books" [showViewMore]="false"></app-book-grid>
    </section>
  `,
  styles: [
    `
      .collection-wrap { padding-top: 1rem; }
      .head { margin-bottom: 1rem; }
      p {
        margin: 0 0 0.35rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.74rem;
        color: #8f623a;
      }
      h3 {
        margin: 0;
        color: var(--brand-dark);
        font-family: "Lato", sans-serif;
      }
    `,
  ],
})
export class DealsCollectionComponent {
  @Input() label = "";
  @Input() title = "";
  @Input() books: Book[] = [];
}

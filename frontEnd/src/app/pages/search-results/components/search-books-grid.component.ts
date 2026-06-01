import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Book } from "../../../models/book.model";
import { BookGridComponent } from "../../../components/book-grid/book-grid.component";
import { IBookSummary } from "../../../models/Book/i-book-summary";

@Component({
  selector: "app-search-books-grid",
  standalone: true,
  imports: [CommonModule, BookGridComponent],
  template: `
    @if (books.length) {
      <app-book-grid [books]="books" [showViewMore]="false"></app-book-grid>
    } @else {
      <div class="empty-state">
        <h3>No matching books yet</h3>
        <p>
          Try a broader title, author name, or switch to a different sorting
          strategy.
        </p>
      </div>
    }
  `,
  styles: [
    `
      .empty-state {
        border-radius: 22px;
        background: #fff;
        padding: 3rem 1.5rem;
        text-align: center;
        border: 1px dashed rgba(199, 139, 81, 0.28);
      }
    `,
  ],
})
export class SearchBooksGridComponent {
  @Input() books: IBookSummary[] = [];
  @Output() add = new EventEmitter<Book>();
}

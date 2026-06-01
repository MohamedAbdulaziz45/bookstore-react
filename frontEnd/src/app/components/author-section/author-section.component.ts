import { Component, Input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiBookService } from "../../services/books/api-book.service";
import { map } from "rxjs";
import { RouterLink } from "@angular/router";
import { IBookSummary } from "../../models/Book/i-book-summary";

@Component({
  selector: "app-author-section",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./author-section.component.html",
})
export class AuthorSectionComponent implements OnInit {
  @Input() name!: string | null;
  @Input() bio!: string | null;
  @Input() IsFallBack? = false;
  @Input() image!: string | null;
  @Input() id!: number | null;
  //@Input() books!: any;

  authorBooks = signal<IBookSummary[]>([]);
  constructor(private apiBookSer: ApiBookService) {}

  ngOnInit() {
    this.apiBookSer
      .getAllBooks(this.name ?? undefined, 4, 1, undefined, undefined)
      .pipe(map((result) => result.items))
      .subscribe((books) => this.authorBooks.set(books));
  }

  toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

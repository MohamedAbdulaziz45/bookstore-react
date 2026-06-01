import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { AuthorProfileCardComponent } from "./components/author-profile-card.component";
import { ApiAuthorService } from "../../services/authors/api-author.service";
import { ApiBookService } from "../../services/books/api-book.service";
import { IAuthor } from "../../models/iauthor";
import { map } from "rxjs";
import { SortedBookGridComponent } from "../../components/sorted-book-grid/sorted-book-grid.component";
import { IBookSummary } from "../../models/Book/i-book-summary";

@Component({
  selector: "app-author-details",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    AuthorProfileCardComponent,

    SortedBookGridComponent,
  ],
  template: `
    <app-header></app-header>
    <app-page-banner
      title="Author Details"
      subtitle="A dedicated destination for author identity, shelf depth, and stronger discovery paths."
    ></app-page-banner>

    <section class="section-py bg-brand">
      <div class="container">
        @if (author()) {
          <app-author-profile-card
            [name]="author()!.name"
            [bio]="author()!.bio"
            [image]="author()!.image ?? null"
            [stats]="stats()"
          ></app-author-profile-card>

          <app-sorted-book-grid
            title="Books By this author"
            [searchPhrase]="author()?.name"
          >
          </app-sorted-book-grid>
        }
      </div>
    </section>

    <app-footer></app-footer>
  `,
})
export class AuthorDetailsComponent {
  private route = inject(ActivatedRoute);
  private apiAuthorService = inject(ApiAuthorService);
  private apiBookService = inject(ApiBookService);

  author = signal<IAuthor | null>(null);
  authorBooks = signal<IBookSummary[]>([]);

  stats = computed(() => [
    { label: "Titles in store", value: String(this.authorBooks().length) },
    {
      label: "Average price",
      value: `$${(
        this.authorBooks().reduce((sum, book) => sum + book.price, 0) /
        Math.max(this.authorBooks().length, 1)
      ).toFixed(2)}`,
    },
  ]);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get("id"));

      if (!Number.isFinite(id) || id <= 0) {
        this.author.set(null);
        this.authorBooks.set([]);
        return;
      }

      this.apiAuthorService.getAuthorById(id).subscribe((author) => {
        this.author.set(author);

        this.apiBookService
          .getAllBooks(author.name, 4, 1, undefined, undefined)
          .pipe(map((result) => result.items))
          .subscribe((books) => this.authorBooks.set(books));
      });
    });
  }
}

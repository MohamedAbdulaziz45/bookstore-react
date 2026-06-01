import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageBannerComponent } from "../../components/page-banner/page-banner.component";
import { BooksService } from "../../services/books.service";
import { SearchSummaryComponent } from "./components/search-summary.component";
import { SearchBooksGridComponent } from "./components/search-books-grid.component";
import { Book } from "../../models/book.model";
import { ToastService } from "../../services/toast.service";
import { ApiBookService } from "../../services/books/api-book.service";
import { IBookSummary } from "../../models/Book/i-book-summary";

@Component({
  selector: "app-search-results",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    PageBannerComponent,
    SearchSummaryComponent,
    SearchBooksGridComponent,
  ],
  template: `
    <app-header></app-header>
    <app-page-banner
      title="Search Results"
      subtitle="A dedicated search surface with clearer intent, better sorting, and room for real filters later."
    ></app-page-banner>

    <section class="section-py bg-brand">
      <div class="container">
        <app-search-summary
          [query]="query"
          [resultsCount]="totalCount()"
          [sort]="sort"
          (search)="onSearch($event)"
          (sortChange)="onSortChange($event)"
        ></app-search-summary>

        @if (isLoading()) {
          <div class="text-center py-5">
            <div class="spinner-border text-gold" role="status"></div>
          </div>
        } @else {
          <div class="mt-4">
            <app-search-books-grid [books]="results()"></app-search-books-grid>
          </div>
        }
      </div>
    </section>

    <app-footer></app-footer>
  `,
})
export class SearchResultsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiBookService = inject(ApiBookService);

  query = "";
  sort = "featured";

  results = signal<IBookSummary[]>([]);
  totalCount = signal(0);
  isLoading = signal(false);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.query = params["search"] ?? "";
      this.sort = params["sort"] ?? "featured";
      this.loadBooks();
    });
  }

  onSearch(search: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search, sort: this.sort },
      queryParamsHandling: "merge",
    });
  }

  onSortChange(sort: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.query, sort },
      queryParamsHandling: "merge",
    });
  }

  private loadBooks() {
    this.isLoading.set(true);

    const { sortBy, sortDirection } = this.mapSort(this.sort);

    this.apiBookService
      .getAllBooks(this.query || undefined, 12, 1, sortBy, sortDirection)
      .subscribe({
        next: (result) => {
          this.results.set(result.items);
          this.totalCount.set(result.totalItemsCount);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  private mapSort(sort: string): {
    sortBy?: string;
    sortDirection: "Ascending" | "Descending";
  } {
    switch (sort) {
      case "price-asc":
        return { sortBy: "Price", sortDirection: "Ascending" };
      case "price-desc":
        return { sortBy: "Price", sortDirection: "Descending" };
      case "title":
        return { sortBy: "Title", sortDirection: "Ascending" };
      default:
        return { sortBy: undefined, sortDirection: "Ascending" };
    }
  }
}

import { Component, inject, OnInit, signal } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";
import { BookGridComponent } from "../../components/book-grid/book-grid.component";
import { CategoriesSectionComponent } from "../../components/categories-section/categories-section.component";
import { FeaturedBookComponent } from "../../components/featured-book/featured-book.component";
import { AuthorSectionComponent } from "../../components/author-section/author-section.component";
import { FeaturesComponent } from "../../components/features/features.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PublisherSectionComponent } from "../../components/publisher-section/publisher-section.component";
import { NewsletterSectionComponent } from "../../components/newsletter-section/newsletter-section.component";
import { CartSidebarComponent } from "../../components/cart-sidebar/cart-sidebar.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { CategoryService } from "../../services/categories/api-category.service";
import { ApiAuthorService } from "../../services/authors/api-author.service";
import { ApiBookService } from "../../services/books/api-book.service";
import { ApiHomeService } from "../../services/home/api-home.service";
import { IBookSummary } from "../../models/Book/i-book-summary";
import { IAuthor } from "../../models/iauthor";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    HeaderComponent,
    HeroSectionComponent,
    BookGridComponent,
    CategoriesSectionComponent,
    FeaturedBookComponent,
    AuthorSectionComponent,
    FooterComponent,
    NewsletterSectionComponent,
    CartSidebarComponent,
  ],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  private apiBookService = inject(ApiBookService);
  private apiHomeService = inject(ApiHomeService);
  private categoryService = inject(CategoryService);

  featuredBooks = signal<IBookSummary[]>([]);
  editorsPicks = signal<IBookSummary[]>([]);
  featuredBooksFallback = signal(false);
  editorsPicksFallback = signal(false);

  categories = toSignal(this.categoryService.getAllCategories(), {
    initialValue: [],
  });

  spotlightBook = signal<IBookSummary | null>(null);
  spotlightAuthor = signal<IAuthor | null>(null);
  spotlightAuthorFallback = signal(false);
  ngOnInit(): void {
    this.apiBookService.getFeatured(8, 1).subscribe({
      next: (result) => {
        this.featuredBooks.set(result.items);
        this.featuredBooksFallback.set(result.meta ?? false);
      },
    });

    this.apiBookService.getEditorsPicks(8, 1).subscribe({
      next: (result) => {
        this.editorsPicks.set(result.items);
        this.editorsPicksFallback.set(result.meta ?? false);
      },
    });

    this.apiHomeService.getSpotlight().subscribe({
      next: (result) => {
        this.spotlightBook.set(result.featuredBook ?? null);
        this.spotlightAuthor.set(result.featuredAuthor ?? null);
        this.spotlightAuthorFallback.set(result.isFeaturedAuthorFallback);
      },
    });
  }
}

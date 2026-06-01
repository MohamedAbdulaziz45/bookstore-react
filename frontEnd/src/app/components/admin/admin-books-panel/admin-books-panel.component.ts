import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AdminAuthor, AdminBook, AdminBookFormValue } from "../../../models/admin/admin.models";
import { icategory } from "../../../models/icategory";
import { ApiAuthorService } from "../../../services/authors/api-author.service";
import { ApiBookService } from "../../../services/books/api-book.service";
import { CategoryService } from "../../../services/categories/api-category.service";

@Component({
  selector: "app-admin-books-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-books-panel.component.html",
  styleUrl: "./admin-books-panel.component.scss",
})
export class AdminBooksPanelComponent implements OnInit {
  books: AdminBook[] = [];
  filteredBooks: AdminBook[] = [];
  authors: AdminAuthor[] = [];
  genres: icategory[] = [];
  loading = false;
  error = "";
  search = "";
  genreFilter = "";
  isDrawerOpen = false;
  editingBook: AdminBook | null = null;
  selectedImage: File | null = null;
  authorSearch = "";
  genreSearch = "";
  quickAuthorName = "";
  quickGenreName = "";
  form: AdminBookFormValue = this.emptyForm();

  constructor(
    private bookService: ApiBookService,
    private authorService: ApiAuthorService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.error = "";
    this.bookService.getAdminBooks(undefined, 100).subscribe({
      next: (page) => {
        this.books = page.items;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load books.";
        this.loading = false;
      },
    });

    this.loadAuthors();
    this.loadGenres();
  }

  loadAuthors(): void {
    this.authorService.getAllAuthors().subscribe({
      next: (authors) => (this.authors = authors as AdminAuthor[]),
      error: () => (this.error = "Could not load authors."),
    });
  }

  loadGenres(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (genres) => (this.genres = genres),
      error: () => (this.error = "Could not load genres."),
    });
  }

  applyFilters(): void {
    const search = this.search.trim().toLowerCase();
    const genreFilter = this.genreFilter;

    this.filteredBooks = this.books.filter((book) => {
      const matchesSearch =
        !search ||
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.isbn.toLowerCase().includes(search);
      const matchesGenre =
        !genreFilter ||
        book.genres.some((genre) => String(genre.id) === genreFilter);
      return matchesSearch && matchesGenre;
    });
  }

  openCreate(): void {
    this.editingBook = null;
    this.selectedImage = null;
    this.form = this.emptyForm();
    this.isDrawerOpen = true;
  }

  openEdit(book: AdminBook): void {
    this.editingBook = book;
    this.selectedImage = null;
    this.form = {
      title: book.title,
      isbn: book.isbn,
      price: book.price,
      quantityInStock: book.stock,
      publicationDate: book.publicationDate.slice(0, 10),
      authorId: book.authorId,
      genreIds: book.genres.map((genre) => genre.id),
      additionalDetails: book.additionalDetails ?? "",
      isFeatured: book.isFeatured,
      isEditorsPick: book.isEditorsPick,
      image: null,
    };
    this.isDrawerOpen = true;
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
    this.form.image = this.selectedImage;
  }

  toggleGenre(genreId: number, checked: boolean): void {
    this.form.genreIds = checked
      ? [...this.form.genreIds, genreId]
      : this.form.genreIds.filter((id) => id !== genreId);
  }

  isGenreSelected(genreId: number): boolean {
    return this.form.genreIds.includes(genreId);
  }

  selectedGenreNames(): string[] {
    return this.genres
      .filter((genre) => this.form.genreIds.includes(Number(genre.genreId)))
      .map((genre) => genre.genreName);
  }

  filteredAuthors(): AdminAuthor[] {
    const term = this.authorSearch.trim().toLowerCase();
    return term
      ? this.authors.filter((author) => author.name.toLowerCase().includes(term))
      : this.authors;
  }

  filteredGenres(): icategory[] {
    const term = this.genreSearch.trim().toLowerCase();
    return term
      ? this.genres.filter((genre) =>
          genre.genreName.toLowerCase().includes(term),
        )
      : this.genres;
  }

  quickCreateAuthor(): void {
    const name = this.quickAuthorName.trim();
    if (!name) return;

    this.authorService
      .createAuthorForm({ name, bio: "Biography pending.", isFeatured: false })
      .subscribe({
        next: () => {
          this.authorService.getAllAuthors().subscribe((authors) => {
            this.authors = authors as AdminAuthor[];
            const created = this.authors.find((author) => author.name === name);
            if (created) this.form.authorId = created.authorId;
            this.quickAuthorName = "";
          });
        },
        error: () => (this.error = "Could not create author."),
      });
  }

  quickCreateGenre(): void {
    const genreName = this.quickGenreName.trim();
    if (!genreName) return;

    this.categoryService.createCategory(genreName).subscribe({
      next: () => {
        this.categoryService.getAllCategories().subscribe((genres) => {
          this.genres = genres;
          const created = this.genres.find((genre) => genre.genreName === genreName);
          if (created) {
            this.toggleGenre(Number(created.genreId), true);
          }
          this.quickGenreName = "";
        });
      },
      error: () => (this.error = "Could not create genre."),
    });
  }

  submit(): void {
    if (!this.isFormValid()) {
      this.error = "Title, ISBN, author, at least one genre, price, stock, date, and details are required.";
      return;
    }

    const request = { ...this.form, image: this.selectedImage };
    const save$ = this.editingBook
      ? this.bookService.updateAdminBook(this.editingBook.id, request)
      : this.bookService.createAdminBook(request);

    this.loading = true;
    save$.subscribe({
      next: () => {
        this.isDrawerOpen = false;
        this.loadAll();
      },
      error: () => {
        this.error = "Could not save book.";
        this.loading = false;
      },
    });
  }

  deleteBook(book: AdminBook): void {
    if (!confirm(`Delete "${book.title}"?`)) return;

    this.loading = true;
    this.bookService.deleteAdminBook(book.id).subscribe({
      next: () => this.loadAll(),
      error: () => {
        this.error = "Could not delete book.";
        this.loading = false;
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  stockClass(book: AdminBook): string {
    return book.stock <= 5 ? "pending" : "shipped";
  }

  stockLabel(book: AdminBook): string {
    return book.stock <= 5 ? "Low Stock" : "Active";
  }

  private isFormValid(): boolean {
    return (
      !!this.form.title.trim() &&
      !!this.form.isbn.trim() &&
      this.form.authorId > 0 &&
      this.form.genreIds.length > 0 &&
      this.form.price >= 0 &&
      this.form.quantityInStock >= 0 &&
      !!this.form.publicationDate &&
      !!(this.form.additionalDetails ?? "").trim()
    );
  }

  private emptyForm(): AdminBookFormValue {
    return {
      title: "",
      isbn: "",
      price: 0,
      quantityInStock: 0,
      publicationDate: new Date().toISOString().slice(0, 10),
      authorId: 0,
      genreIds: [],
      additionalDetails: "",
      isFeatured: false,
      isEditorsPick: false,
      image: null,
    };
  }
}

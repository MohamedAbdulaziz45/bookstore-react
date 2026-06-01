import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { icategory } from "../../../models/icategory";
import { CategoryService } from "../../../services/categories/api-category.service";

@Component({
  selector: "app-admin-genres-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-genres-panel.component.html",
  styleUrl: "./admin-genres-panel.component.scss",
})
export class AdminGenresPanelComponent implements OnInit {
  genres: icategory[] = [];
  filteredGenres: icategory[] = [];
  loading = false;
  error = "";
  search = "";
  isModalOpen = false;
  editingGenre: icategory | null = null;
  genreName = "";

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.loading = true;
    this.error = "";
    this.categoryService.getAllCategories().subscribe({
      next: (genres) => {
        this.genres = genres;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load genres.";
        this.loading = false;
      },
    });
  }

  applySearch(): void {
    const term = this.search.trim().toLowerCase();
    this.filteredGenres = term
      ? this.genres.filter((genre) =>
          genre.genreName.toLowerCase().includes(term),
        )
      : [...this.genres];
  }

  openCreate(): void {
    this.editingGenre = null;
    this.genreName = "";
    this.isModalOpen = true;
  }

  openEdit(genre: icategory): void {
    this.editingGenre = genre;
    this.genreName = genre.genreName;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submit(): void {
    const name = this.genreName.trim();
    if (!name) {
      this.error = "Genre name is required.";
      return;
    }

    const save$ = this.editingGenre
      ? this.categoryService.updateCategory(this.editingGenre.genreId, name)
      : this.categoryService.createCategory(name);

    this.loading = true;
    save$.subscribe({
      next: () => {
        this.isModalOpen = false;
        this.loadGenres();
      },
      error: () => {
        this.error = "Could not save genre.";
        this.loading = false;
      },
    });
  }

  deleteGenre(genre: icategory): void {
    if (!confirm(`Delete genre "${genre.genreName}"?`)) return;

    this.loading = true;
    this.categoryService.deleteCategory(genre.genreId).subscribe({
      next: () => this.loadGenres(),
      error: () => {
        this.error = "Could not delete genre.";
        this.loading = false;
      },
    });
  }
}

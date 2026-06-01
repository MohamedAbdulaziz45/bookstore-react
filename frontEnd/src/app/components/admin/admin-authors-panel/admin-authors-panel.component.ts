import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiAuthorService } from "../../../services/authors/api-author.service";
import {
  AdminAuthor,
  AdminAuthorFormValue,
} from "../../../models/admin/admin.models";

@Component({
  selector: "app-admin-authors-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-authors-panel.component.html",
  styleUrl: "./admin-authors-panel.component.scss",
})
export class AdminAuthorsPanelComponent implements OnInit {
  authors: AdminAuthor[] = [];
  filteredAuthors: AdminAuthor[] = [];
  loading = false;
  error = "";
  search = "";
  isFormOpen = false;
  editingAuthor: AdminAuthor | null = null;
  selectedImage: File | null = null;
  form: AdminAuthorFormValue = this.emptyForm();

  constructor(private authorService: ApiAuthorService) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.loading = true;
    this.error = "";
    this.authorService.getAllAuthors().subscribe({
      next: (authors) => {
        this.authors = authors as AdminAuthor[];
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load authors.";
        this.loading = false;
      },
    });
  }

  applySearch(): void {
    const term = this.search.trim().toLowerCase();
    this.filteredAuthors = term
      ? this.authors.filter(
          (author) =>
            author.name.toLowerCase().includes(term) ||
            author.bio.toLowerCase().includes(term),
        )
      : [...this.authors];
  }

  openCreate(): void {
    this.editingAuthor = null;
    this.selectedImage = null;
    this.form = this.emptyForm();
    this.isFormOpen = true;
  }

  openEdit(author: AdminAuthor): void {
    this.editingAuthor = author;
    this.selectedImage = null;
    this.form = {
      name: author.name,
      bio: author.bio,
      isFeatured: author.isFeatured,
      image: null,
    };
    this.isFormOpen = true;
  }

  closeForm(): void {
    this.isFormOpen = false;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
    this.form.image = this.selectedImage;
  }

  submit(): void {
    if (!this.form.name.trim() || !this.form.bio.trim()) {
      this.error = "Author name and bio are required.";
      return;
    }

    const request = { ...this.form, image: this.selectedImage };
    const save$ = this.editingAuthor
      ? this.authorService.updateAuthorForm(
          this.editingAuthor.authorId,
          request,
        )
      : this.authorService.createAuthorForm(request);

    this.loading = true;
    save$.subscribe({
      next: () => {
        this.isFormOpen = false;
        this.loadAuthors();
      },
      error: () => {
        this.error = "Could not save author.";
        this.loading = false;
      },
    });
  }

  deleteAuthor(author: AdminAuthor): void {
    if (!confirm(`Delete author "${author.name}"?`)) return;

    this.loading = true;
    this.authorService.deleteAuthor(author.authorId).subscribe({
      next: () => this.loadAuthors(),
      error: () => {
        this.error = "Could not delete author.";
        this.loading = false;
      },
    });
  }

  private emptyForm(): AdminAuthorFormValue {
    return {
      name: "",
      bio: "",
      isFeatured: false,
      image: null,
    };
  }
}

import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

export interface GenreCard {
  title: string;
  count: number;
  tone: string;
  description: string;
  link?: string;
  genreId?: number;
}

@Component({
  selector: "app-genre-grid",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="row g-4">
      @for (genre of genres; track genre.title) {
        <div class="col-md-6 col-xl-4">
          @if (genre.link) {
            <a
              class="genre-card d-block h-100 text-decoration-none"
              [routerLink]="genre.link"
            >
              <div class="accent" [style.background]="genre.tone"></div>
              <p class="meta">{{ genre.count }} titles</p>
              <h3>{{ genre.title }}</h3>
              <p class="copy">{{ genre.description }}</p>
              <span class="cta">Explore shelf</span>
            </a>
          } @else {
            <div class="genre-card genre-card-disabled h-100">
              <div class="accent" [style.background]="genre.tone"></div>
              <p class="meta">{{ genre.count }} titles</p>
              <h3>{{ genre.title }}</h3>
              <p class="copy">{{ genre.description }}</p>
              <span class="cta cta-muted">Browse unavailable</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .genre-card {
        border-radius: 22px;
        background: #fff;
        padding: 1.4rem;
        min-height: 220px;
        box-shadow: 0 14px 35px rgba(34, 25, 15, 0.07);
        border: 1px solid rgba(199, 139, 81, 0.14);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .genre-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 45px rgba(34, 25, 15, 0.12);
      }
      .genre-card-disabled {
        opacity: 0.88;
        cursor: not-allowed;
      }
      .genre-card-disabled:hover {
        transform: none;
        box-shadow: 0 14px 35px rgba(34, 25, 15, 0.07);
      }
      .accent {
        width: 68px;
        height: 6px;
        border-radius: 999px;
        margin-bottom: 1rem;
      }
      .meta {
        font-size: 0.78rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #8f623a;
        margin-bottom: 0.7rem;
      }
      h3 {
        font-size: 1.2rem;
        color: var(--brand-dark);
        margin-bottom: 0.7rem;
        font-family: "Lato", sans-serif;
      }
      .copy {
        color: var(--brand-gray);
        line-height: 1.65;
        margin-bottom: 1rem;
      }
      .cta {
        font-weight: 700;
        color: #c78b51;
      }
      .cta-muted {
        color: #8d847b;
      }
    `,
  ],
})
export class GenreGridComponent {
  @Input() genres: GenreCard[] = [];
}

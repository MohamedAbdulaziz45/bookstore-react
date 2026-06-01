import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-banner">
      <div class="container text-center">
        <h1 class="section-title mb-2">{{ title }}</h1>
        @if (subtitle) {
          <p class="text-brand-gray mb-3" style="max-width:580px;margin:0 auto">{{ subtitle }}</p>
        }
        @if (showBreadcrumb) {
          <nav aria-label="breadcrumb" class="mt-2">
            <ol class="breadcrumb justify-content-center mb-0">
              <li class="breadcrumb-item">
                <a routerLink="/" class="text-gold">Home</a>
              </li>
              <li class="breadcrumb-item active text-brand-gray">{{ title }}</li>
            </ol>
          </nav>
        }
      </div>
    </div>
  `
})
export class PageBannerComponent {
  @Input() title!: string;
  @Input() subtitle = '';
  @Input() showBreadcrumb = true;
}

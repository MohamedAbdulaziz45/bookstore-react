import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-publisher-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section-py bg-warm">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-5 text-center">
            <img
              src="https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/publisher-image.png"
              alt="Publishing partner" class="img-fluid" style="max-height:360px" />
          </div>
          <div class="col-lg-7">
            <span class="section-label">Become Our Partner</span>
            <h2 class="section-title mb-4">Self-Publishing And Book Writing</h2>
            <p class="text-brand-gray lh-lg mb-4">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
              sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <a routerLink="/contact"
               class="btn btn-gold btn-lg px-5 text-uppercase fw-bold">
              Contact Now
            </a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class PublisherSectionComponent {}

import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiNewsletterService } from "../../services/newsletter/api-newsletter.service";

@Component({
  selector: "app-newsletter-section",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="newsletter-section py-5">
      <div class="container py-4">
        <div class="row align-items-center g-4">
          <div class="col-lg-6">
            <h2 class="fw-bold mb-3" style="font-size:clamp(1.5rem,3vw,2.2rem)">
              Join Book Lovers Community<br />and Get Latest Updates
            </h2>
            <p class="mb-4" style="color:rgba(255,255,255,.6)">
              Subscribe to receive news about new arrivals, author spotlights
              and exclusive deals.
            </p>

            <!-- Subscribe -->
            <form
              (submit)="onSubscribe($event)"
              class="d-flex gap-2 mb-3"
              style="max-width:460px"
            >
              <input
                type="email"
                [(ngModel)]="subEmail"
                name="subEmail"
                required
                class="nl-input flex-grow-1"
                placeholder="Your email address"
              />
              <button
                type="submit"
                class="btn btn-gold fw-bold text-uppercase px-4"
                [disabled]="subLoading()"
              >
                {{ subLoading() ? "..." : "Subscribe" }}
              </button>
            </form>
            @if (subOk()) {
              <p class="text-gold fw-semibold mb-2 small">
                <i class="bi bi-check-circle-fill me-1"></i>Thank you for
                subscribing!
              </p>
            }
            @if (subError()) {
              <p class="text-danger fw-semibold mb-2 small">
                <i class="bi bi-x-circle-fill me-1"></i>{{ subError() }}
              </p>
            }

            <!-- Unsubscribe -->
            <div
              style="border-top:1px solid rgba(255,255,255,.12);padding-top:16px;margin-top:8px"
            >
              <p
                class="mb-2"
                style="font-size:.85rem;color:rgba(255,255,255,.5)"
              >
                Want to unsubscribe? Enter your email below.
              </p>
              <form
                (submit)="onUnsubscribe($event)"
                class="d-flex gap-2"
                style="max-width:460px"
              >
                <input
                  type="email"
                  [(ngModel)]="unsubEmail"
                  name="unsubEmail"
                  required
                  class="nl-input flex-grow-1"
                  placeholder="Your email address"
                />
                <button
                  type="submit"
                  class="btn btn-outline-light fw-bold text-uppercase px-4"
                  style="border-radius:6px;font-size:.82rem"
                  [disabled]="unsubLoading()"
                >
                  {{ unsubLoading() ? "..." : "Unsubscribe" }}
                </button>
              </form>
              @if (unsubOk()) {
                <p
                  class="fw-semibold mt-2 mb-0 small"
                  style="color:rgba(255,255,255,.7)"
                >
                  <i class="bi bi-check-circle-fill me-1"></i>You have been
                  unsubscribed.
                </p>
              }
              @if (unsubError()) {
                <p class="text-danger fw-semibold mt-2 mb-0 small">
                  <i class="bi bi-x-circle-fill me-1"></i>{{ unsubError() }}
                </p>
              }
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-flex justify-content-end">
            <img
              src="https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/subscribe-image.png"
              alt="Subscribe"
              style="max-height:220px"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NewsletterSectionComponent {
  private newsletterService = inject(ApiNewsletterService);

  subEmail = "";
  subOk = signal(false);
  subError = signal("");
  subLoading = signal(false);

  unsubEmail = "";
  unsubOk = signal(false);
  unsubError = signal("");
  unsubLoading = signal(false);

  onSubscribe(e: Event) {
    e.preventDefault();
    if (!this.subEmail) return;

    this.subOk.set(false);
    this.subError.set("");
    this.subLoading.set(true);

    this.newsletterService.subscribe(this.subEmail).subscribe({
      next: () => {
        this.subOk.set(true);
        this.subEmail = "";
        this.subLoading.set(false);
        setTimeout(() => this.subOk.set(false), 4000);
      },
      error: () => {
        this.subError.set("Something went wrong. Please try again.");
        this.subLoading.set(false);
        setTimeout(() => this.subError.set(""), 4000);
      },
    });
  }

  onUnsubscribe(e: Event) {
    e.preventDefault();
    if (!this.unsubEmail) return;

    this.unsubOk.set(false);
    this.unsubError.set("");
    this.unsubLoading.set(true);

    this.newsletterService.unsubscribe(this.unsubEmail).subscribe({
      next: () => {
        this.unsubOk.set(true);
        this.unsubEmail = "";
        this.unsubLoading.set(false);
        setTimeout(() => this.unsubOk.set(false), 4000);
      },
      error: () => {
        this.unsubError.set("Something went wrong. Please try again.");
        this.unsubLoading.set(false);
        setTimeout(() => this.unsubError.set(""), 4000);
      },
    });
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, CartSidebarComponent],
  template: `
    <app-cart-sidebar></app-cart-sidebar>
    <app-header></app-header>
    <div class="d-flex flex-column align-items-center justify-content-center text-center section-py px-3" style="min-height:70vh">
      <div class="not-found-num mb-3">404</div>
      <h2 class="fw-bold mb-3">Page Not Found</h2>
      <p class="text-brand-gray mb-5 mx-auto" style="max-width:380px">
        Oops! This page seems to have wandered off. Let's get you back to the bookstore.
      </p>
      <a routerLink="/" class="btn btn-gold btn-lg px-5 fw-bold text-uppercase">
        <i class="bi bi-arrow-left me-2"></i>Back to Home
      </a>
    </div>
    <app-footer></app-footer>
  `
})
export class NotFoundComponent {}

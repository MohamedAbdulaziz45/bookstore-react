import { Routes } from "@angular/router";
import { CheckLoginGuard } from "./guards/check-login.guard";
import { checkAdminGuard } from "./guards/check-admin.guard";
import { profileCompleteGuard } from "./guards/profile-complete.guard";

export const routes: Routes = [
  // ── Public pages ──
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((c) => c.HomeComponent),
  },
  {
    path: "genres",
    loadComponent: () =>
      import("./pages/genres/genres.component").then((c) => c.GenresComponent),
  },
  {
    path: "genres/:id/:slug",
    loadComponent: () =>
      import("./pages/genre-details/genre-details.component").then(
        (c) => c.GenreDetailsComponent,
      ),
  },
  {
    path: "search-results",
    loadComponent: () =>
      import("./pages/search-results/search-results.component").then(
        (c) => c.SearchResultsComponent,
      ),
  },
  {
    path: "all-books",
    loadComponent: () =>
      import("./pages/all-books/all-books.component").then(
        (c) => c.AllBooksComponent,
      ),
  },
  {
    path: "new-arrival",
    loadComponent: () =>
      import("./pages/new-arrival/new-arrival.component").then(
        (c) => c.NewArrivalComponent,
      ),
  },
  {
    path: "featured-books",
    loadComponent: () =>
      import("./pages/featured/featured-books").then(
        (c) => c.FeaturedComponent,
      ),
  },
  {
    path: "editors-pick",
    loadComponent: () =>
      import("./pages/editors-pick/editors-pick.component").then(
        (c) => c.EditorsPickComponent,
      ),
  },
  {
    path: "about",
    loadComponent: () =>
      import("./pages/about/about.component").then((c) => c.AboutComponent),
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./pages/contact/contact.component").then(
        (c) => c.ContactComponent,
      ),
  },
  {
    path: "wishlist",
    loadComponent: () =>
      import("./pages/wishlist/wishlist.component").then(
        (c) => c.WishlistComponent,
      ),
  },
  {
    path: "orders/:id",
    loadComponent: () =>
      import("./pages/order-tracking/order-tracking.component").then(
        (c) => c.OrderTrackingComponent,
      ),
  },
  {
    path: "faq",
    loadComponent: () =>
      import("./pages/faq/faq.component").then((c) => c.FaqComponent),
  },
  {
    path: "deals",
    loadComponent: () =>
      import("./pages/deals/deals.component").then((c) => c.DealsComponent),
  },
  {
    path: "author/:id/:slug",
    loadComponent: () =>
      import("./pages/author-details/author-details.component").then(
        (c) => c.AuthorDetailsComponent,
      ),
  },
  {
    path: "author/:id",
    loadComponent: () =>
      import("./pages/author-details/author-details.component").then(
        (c) => c.AuthorDetailsComponent,
      ),
  },
  {
    path: "book/:id/:slug",
    loadComponent: () =>
      import("./pages/book-detail/book-detail.component").then(
        (c) => c.BookDetailComponent,
      ),
  },
  {
    path: "book/:id",
    loadComponent: () =>
      import("./pages/book-detail/book-detail.component").then(
        (c) => c.BookDetailComponent,
      ),
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./pages/cart/cart.component").then((c) => c.CartComponent),
  },

  // ── Protected pages ──
  {
    path: "checkout",
    loadComponent: () =>
      import("./pages/checkout/checkout.component").then(
        (c) => c.CheckoutComponent,
      ),
    canActivate: [CheckLoginGuard],
  },
  {
    path: "admin-dashboard",
    loadComponent: () =>
      import("./pages/admin-dashboard/admin-dashboard.component").then(
        (c) => c.AdminDashboardComponent,
      ),
    canActivate: [CheckLoginGuard, checkAdminGuard],
  },
  {
    path: "my-account",
    loadComponent: () =>
      import("./pages/customer-dashboard/customer-dashboard.component").then(
        (c) => c.CustomerDashboardComponent,
      ),
    canActivate: [CheckLoginGuard],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./pages/profile/profile.component").then(
        (c) => c.ProfileComponent,
      ),
    canActivate: [CheckLoginGuard],
  },

  // ── Fallback ──
  {
    path: "404",
    loadComponent: () =>
      import("./pages/not-found/not-found.component").then(
        (c) => c.NotFoundComponent,
      ),
  },
  {
    path: "**",
    loadComponent: () =>
      import("./pages/not-found/not-found.component").then(
        (c) => c.NotFoundComponent,
      ),
  },
];

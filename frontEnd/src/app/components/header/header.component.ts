import { Component, ViewChild, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CartService } from "../../services/cart.service";
import { ToastService } from "../../services/toast.service";
import { AuthModalComponent } from "../auth-modal/auth-modal.component";
import { ApiUserService } from "../../services/users/api-user.service";
import { ChangePasswordModalComponent } from "../change-password-modal/change-password-modal.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    AuthModalComponent,
    ChangePasswordModalComponent,
  ],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  @ViewChild(AuthModalComponent) authModal?: AuthModalComponent;

  showChangePasswordModal = false;
  navItems = [
    { label: "Genres", path: "/genres" },
    { label: "All Books", path: "/all-books" },
    { label: "New Arrival", path: "/new-arrival" },
    { label: "Featured Books", path: "/featured-books" },
    { label: "Editor's Pick", path: "/editors-pick" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  router = inject(Router);
  toastService = inject(ToastService);
  searchQuery = "";

  constructor(
    public cartService: CartService,
    public userService: ApiUserService,
  ) {}

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/search-results"], {
        queryParams: { search: this.searchQuery },
      });
      this.searchQuery = "";
    }
  }

  onLogin(user: any) {
    this.toastService.show(`Successfully logged in!`, "success");
  }

  openAuthModal(mode: "login" | "signup" = "login") {
    if (mode === "signup") {
      this.authModal?.setSignupMode();
      return;
    }

    this.authModal?.setLoginMode();
  }

  onLogout() {
    this.userService.logout();
    this.cartService.switchToGuestCart();
    this.router.navigate(["/"]);
    this.toastService.show("Successfully logged out", "info");
  }
}

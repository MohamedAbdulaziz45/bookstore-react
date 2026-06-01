import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { CartSidebarComponent } from "../../components/cart-sidebar/cart-sidebar.component";
import { CustomerSidebarComponent } from "../../components/customer/customer-sidebar/customer-sidebar.component";
import { CustomerOrdersPanelComponent } from "../../components/customer/customer-orders-panel/customer-orders-panel.component";
import { CustomerReviewsPanelComponent } from "../../components/customer/customer-reviews-panel/customer-reviews-panel.component";
import { CustomerProfilePanelComponent } from "../../components/customer/customer-profile-panel/customer-profile-panel.component";
import { CustomerAddressesPanelComponent } from "../../components/customer/customer-addresses-panel/customer-addresses-panel.component";
import { CustomerNotificationsPanelComponent } from "../../components/customer/customer-notifications-panel/customer-notifications-panel.component";
import { CustomerPasswordPanelComponent } from "../../components/customer/customer-password-panel/customer-password-panel.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ApiUserService } from "../../services/users/api-user.service";
import { ApiOrdersService } from "../../services/orders/api-orders.service";
import { ApiReviewService } from "../../services/reviews/api-review.service";
import { ApiAddressService } from "../../services/addresses/api-address.service";
import { ApiNotificationsService } from "../../services/notifications/api-notifications.service";
import { IUserDetails } from "../../models/Auth/UserDetails/iuser-details";
import { getImageUrl } from "../../Utils/cloudinary.utils";
import { CartService } from "../../services/cart.service";
import { ToastService } from "../../services/toast.service";

type CustomerDashboardTab =
  | "orders"
  | "reviews"
  | "addresses"
  | "notifications";

@Component({
  selector: "app-customer-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CartSidebarComponent,
    CustomerSidebarComponent,
    CustomerOrdersPanelComponent,
    CustomerReviewsPanelComponent,
    CustomerProfilePanelComponent,
    CustomerAddressesPanelComponent,
    CustomerNotificationsPanelComponent,
    CustomerPasswordPanelComponent,
  ],
  templateUrl: "./customer-dashboard.component.html",
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(ApiUserService);
  private ordersService = inject(ApiOrdersService);
  private reviewsService = inject(ApiReviewService);
  private addressService = inject(ApiAddressService);
  private notificationsService = inject(ApiNotificationsService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private sub?: Subscription;

  activePanel = "orders";
  userDetails: IUserDetails | null = null;
  userDisplayName = "My Account";
  userInitials = "U";
  userAvatarUrl: string | null = null;
  tabCounts: Record<CustomerDashboardTab, number | null> = {
    orders: null,
    reviews: null,
    addresses: null,
    notifications: null,
  };

  private totalOrdersValue = "-";
  private totalSpentValue = "-";
  private reviewsGivenValue = "-";

  heroStats = [
    { value: "-", label: "Total Orders" },
    { value: "-", label: "Total Spent" },
    { value: "-", label: "Reviews Given" },
  ];

  ngOnInit(): void {
    this.loadUserDetails();
    this.loadSummary();

    this.sub = this.route.queryParamMap.subscribe((params) => {
      const tab = params.get("tab");
      if (tab && this.isAllowedTab(tab)) {
        this.activePanel = tab;
        return;
      }
      this.activePanel = "orders";
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  showPanel(panel: string): void {
    if (!this.isAllowedTab(panel)) return;
    this.activePanel = panel;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: panel },
      queryParamsHandling: "merge",
    });
  }

  onSignOut(): void {
    this.userService.logout();
    this.cartService.switchToGuestCart();
    this.toastService.show("Successfully logged out", "info");
    void this.router.navigate(["/"]);
  }

  onProfileUpdated(user: IUserDetails): void {
    this.applyUserDetails(user);
  }

  onReviewCountChanged(count: number): void {
    this.reviewsGivenValue = `${count}`;
    this.setTabCount("reviews", count);
    this.updateHeroStats();
  }

  onAddressCountChanged(count: number): void {
    this.setTabCount("addresses", count);
  }

  onUnreadNotificationsChanged(count: number): void {
    this.setTabCount("notifications", count);
  }

  private loadUserDetails(): void {
    this.userService.getUserDetails().subscribe({
      next: (data) => {
        this.applyUserDetails(data);
      },
    });
  }

  private loadSummary(): void {
    this.ordersService.getMySummary().subscribe({
      next: (summary) => {
        this.totalOrdersValue = `${summary.totalOrders}`;
        this.totalSpentValue = `${summary.totalSpent.toFixed(2)} EGP`;
        this.setTabCount("orders", summary.totalOrders);
        this.updateHeroStats();
      },
    });

    this.reviewsService.getMyReviews().subscribe({
      next: (reviews) => {
        this.onReviewCountChanged(reviews?.length ?? 0);
      },
    });

    this.addressService.getMyAddresses().subscribe({
      next: (addresses) => {
        this.setTabCount("addresses", addresses?.length ?? 0);
      },
    });

    this.notificationsService.getUnreadCount().subscribe({
      next: (result) => {
        this.setTabCount("notifications", result.unreadCount ?? 0);
      },
    });
  }

  private applyUserDetails(data: IUserDetails): void {
    this.userDetails = data;
    this.userDisplayName = this.resolveDisplayName(data);
    this.userInitials = this.resolveInitials(this.userDisplayName);
    this.userAvatarUrl = data.imagePath
      ? getImageUrl(data.imagePath, "avatar")
      : null;
  }

  private updateHeroStats(): void {
    this.heroStats = [
      { value: this.totalOrdersValue, label: "Total Orders" },
      { value: this.totalSpentValue, label: "Total Spent" },
      { value: this.reviewsGivenValue, label: "Reviews Given" },
    ];
  }

  private setTabCount(tab: CustomerDashboardTab, count: number): void {
    this.tabCounts = { ...this.tabCounts, [tab]: count };
  }

  private resolveDisplayName(user: IUserDetails): string {
    const full = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    if (full) return full;
    if (user.displayName?.trim()) return user.displayName;
    return "My Account";
  }

  private resolveInitials(name: string): string {
    const parts = name.split(" ").filter(Boolean).slice(0, 2);
    if (parts.length === 0) return "U";
    return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  }

  private isAllowedTab(tab: string): boolean {
    return [
      "orders",
      "reviews",
      "profile",
      "addresses",
      "notifications",
      "password",
    ].includes(tab);
  }
}

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

type CustomerSidebarTabCounts = Partial<
  Record<"orders" | "reviews" | "addresses" | "notifications", number | null>
>;

@Component({
  selector: "app-customer-sidebar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./customer-sidebar.component.html",
})
export class CustomerSidebarComponent {
  @Input() activePanel: string = "orders";
  @Input() tabCounts: CustomerSidebarTabCounts = {};
  @Output() panelChange = new EventEmitter<string>();
  @Output() signOut = new EventEmitter<void>();

  showPanel(panelId: string) {
    this.panelChange.emit(panelId);
  }

  onSignOut(): void {
    this.signOut.emit();
  }
}

import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChangePasswordModalComponent } from "../../change-password-modal/change-password-modal.component";

@Component({
  selector: "app-customer-password-panel",
  standalone: true,
  imports: [CommonModule, ChangePasswordModalComponent],
  templateUrl: "./customer-password-panel.component.html",
})
export class CustomerPasswordPanelComponent {
  showModal = false;
}

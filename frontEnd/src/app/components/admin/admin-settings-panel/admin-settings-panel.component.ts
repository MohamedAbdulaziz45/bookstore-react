import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiUserService } from "../../../services/users/api-user.service";

@Component({
  selector: "app-admin-settings-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-settings-panel.component.html",
  styleUrl: "./admin-settings-panel.component.scss",
})
export class AdminSettingsPanelComponent implements OnInit {
  loading = false;
  error = "";
  success = "";
  profile = {
    displayName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };
  selectedImage: File | null = null;
  password = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  constructor(private userService: ApiUserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.userService.getUserDetails().subscribe({
      next: (user) => {
        this.profile = {
          displayName: user.displayName ?? "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          phoneNumber: user.phoneNumber ?? "",
        };
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load profile.";
        this.loading = false;
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
  }

  saveProfile(): void {
    this.loading = true;
    this.error = "";
    this.success = "";
    this.userService
      .updateUser({ ...this.profile, image: this.selectedImage ?? undefined })
      .subscribe({
        next: () => {
          this.success = "Profile updated.";
          this.loading = false;
        },
        error: () => {
          this.error = "Could not update profile.";
          this.loading = false;
        },
      });
  }

  changePassword(): void {
    if (this.password.newPassword !== this.password.confirmNewPassword) {
      this.error = "Password confirmation does not match.";
      return;
    }

    this.loading = true;
    this.error = "";
    this.success = "";
    this.userService
      .changePassword(
        this.password.currentPassword,
        this.password.newPassword,
        this.password.confirmNewPassword,
      )
      .subscribe({
        next: () => {
          this.success = "Password changed.";
          this.password = {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          };
          this.loading = false;
        },
        error: () => {
          this.error = "Could not change password.";
          this.loading = false;
        },
      });
  }
}

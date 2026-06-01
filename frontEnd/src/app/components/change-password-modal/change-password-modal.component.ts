import { Component, EventEmitter, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ApiUserService } from "../../services/users/api-user.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-change-password-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()"></div>
    <div class="modal-dialog-centered">
      <div class="card-box" style="max-width:480px;margin:0 auto">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div style="font-weight:700;font-size:1.05rem">
            <i class="bi bi-shield-lock me-2"></i>Change Password
          </div>
          <button
            class="btn-close"
            style="filter:invert(1);opacity:.5"
            (click)="close.emit()"
          ></button>
        </div>

        <p style="font-size:.85rem;color:var(--brand-gray);margin-bottom:20px">
          Ensure your account is using a strong password for security.
        </p>

        <div class="row g-3">
          <div class="col-12">
            <div class="form-label-sm">Current Password</div>
            <input
              class="form-control-custom"
              type="password"
              [(ngModel)]="currentPassword"
              name="currentPassword"
              placeholder="Enter current password"
            />
          </div>
          <div class="col-md-6">
            <div class="form-label-sm">New Password</div>
            <input
              class="form-control-custom"
              type="password"
              [(ngModel)]="newPassword"
              name="newPassword"
              placeholder="Enter new password"
            />
          </div>
          <div class="col-md-6">
            <div class="form-label-sm">Confirm New Password</div>
            <input
              class="form-control-custom"
              type="password"
              [(ngModel)]="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        @if (errorMsg) {
          <div
            class="alert alert-danger mt-3 mb-0 py-2"
            style="font-size:.82rem;border-radius:8px"
          >
            {{ errorMsg }}
          </div>
        }

        <div
          style="margin-top:16px;padding:14px 16px;background:var(--brand-bg);border-radius:10px;border:1px solid var(--brand-border)"
        >
          <div style="font-weight:600;font-size:.85rem;margin-bottom:8px">
            Password Requirements:
          </div>
          <ul
            style="font-size:.82rem;color:var(--brand-gray);margin:0;padding-left:18px;line-height:1.8"
          >
            <li>At least 8 characters long</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character</li>
          </ul>
        </div>

        <div class="d-flex gap-2 mt-4">
          <button
            class="btn-gold-cust"
            [disabled]="isSubmitting"
            (click)="onSubmit()"
          >
            {{ isSubmitting ? "Updating..." : "Update Password" }}
          </button>
          <button class="btn-outline-cust" (click)="close.emit()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1040;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(4px);
      }
      .modal-dialog-centered {
        position: fixed;
        inset: 0;
        z-index: 1050;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
    `,
  ],
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();

  private userService = inject(ApiUserService);
  private toastService = inject(ToastService);

  currentPassword = "";
  newPassword = "";
  confirmNewPassword = "";
  isSubmitting = false;
  errorMsg = "";

  onSubmit(): void {
    this.errorMsg = "";

    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmNewPassword
    ) {
      this.errorMsg = "All fields are required.";
      return;
    }
    if (this.newPassword.length < 8) {
      this.errorMsg = "Password must be at least 8 characters long.";
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMsg = "New password and confirmation do not match.";
      return;
    }

    this.isSubmitting = true;
    this.userService
      .changePassword(
        this.currentPassword,
        this.newPassword,
        this.confirmNewPassword,
      )
      .subscribe({
        next: () => {
          this.toastService.show("Password updated successfully", "success");
          this.isSubmitting = false;
          this.close.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          const msg =
            err?.error?.detail ||
            err?.error?.title ||
            "Failed to update password. Check your current password.";
          this.errorMsg = msg;
        },
      });
  }
}

import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { IUserDetails } from "../../../models/Auth/UserDetails/iuser-details";
import { IUpdateUserRequest } from "../../../models/Auth/UserDetails/iupdate-user-request";
import { ApiUserService } from "../../../services/users/api-user.service";
import { ToastService } from "../../../services/toast.service";
import { getImageUrl } from "../../../Utils/cloudinary.utils";

@Component({
  selector: "app-customer-profile-panel",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./customer-profile-panel.component.html",
})
export class CustomerProfilePanelComponent implements OnInit {
  @Output() profileUpdated = new EventEmitter<IUserDetails>();

  private fb = inject(FormBuilder);
  private userService = inject(ApiUserService);
  private toastService = inject(ToastService);

  profileForm: FormGroup;
  currentUserData: IUserDetails | null = null;
  currentImageUrl: string | null = null;
  selectedImage: File | null = null;
  isLoading = true;
  isSubmitting = false;

  protected getImageUrl = getImageUrl;

  constructor() {
    this.profileForm = this.fb.group({
      displayName: ["", [Validators.maxLength(100)]],
      firstName: ["", [Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ["", [Validators.minLength(2), Validators.maxLength(50)]],
      email: [{ value: "", disabled: true }],
      phoneNumber: ["", [Validators.pattern(/^\+?[0-9\s-]{7,15}$/)]],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;

    this.userService.getUserDetails().subscribe({
      next: (user) => {
        this.currentUserData = user;
        this.currentImageUrl = user.imagePath ?? null;
        this.patchForm(user);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show("Failed to load profile information", "error");
      },
    });
  }

  resetForm(): void {
    if (!this.currentUserData) return;

    this.patchForm(this.currentUserData);
    this.currentImageUrl = this.currentUserData.imagePath ?? null;
    this.selectedImage = null;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const values = this.profileForm.getRawValue();
    const updateRequest: IUpdateUserRequest = {
      displayName: values.displayName?.trim() || undefined,
      firstName: values.firstName?.trim() || undefined,
      lastName: values.lastName?.trim() || undefined,
      phoneNumber: values.phoneNumber?.trim() || undefined,
      image: this.selectedImage ?? undefined,
    };

    this.userService.updateUser(updateRequest).subscribe({
      next: () => {
        const displayName = values.displayName?.trim();
        const firstName = values.firstName?.trim();
        const lastName = values.lastName?.trim();
        const phoneNumber = values.phoneNumber?.trim();
        const updatedUser: IUserDetails = {
          ...(this.currentUserData ?? { email: values.email }),
          displayName: displayName || this.currentUserData?.displayName,
          firstName: firstName || this.currentUserData?.firstName,
          lastName: lastName || this.currentUserData?.lastName,
          phoneNumber: phoneNumber || this.currentUserData?.phoneNumber,
          imagePath: this.currentImageUrl ?? undefined,
        };

        this.currentUserData = updatedUser;
        this.selectedImage = null;
        this.isSubmitting = false;
        this.profileUpdated.emit(updatedUser);
        this.toastService.show("Profile updated successfully", "success");
      },
      error: (err) => {
        this.isSubmitting = false;
        const message =
          err?.error?.detail ||
          err?.error?.title ||
          "Failed to update profile information";
        this.toastService.show(message, "error");
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentImageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onImageError(): void {
    this.currentImageUrl = null;
  }

  private patchForm(user: IUserDetails): void {
    this.profileForm.patchValue({
      displayName: user.displayName ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
    });
    this.profileForm.markAsPristine();
  }
}

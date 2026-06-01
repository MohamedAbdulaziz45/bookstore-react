import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "../../services/toast.service";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ApiUserService } from "../../services/users/api-user.service";
import { IUserDetails } from "../../models/Auth/UserDetails/iuser-details";
import { IUpdateUserRequest } from "../../models/Auth/UserDetails/iupdate-user-request";
import { getImageUrl } from "../../Utils/cloudinary.utils";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: "./profile.component.html",
  styles: [
    `
      .form-control {
        border-radius: 8px;
        padding: 0.6rem 1rem;
        border-color: #dee2e6;
      }
      .form-control:focus {
        box-shadow: 0 0 0 0.25rem rgba(199, 139, 81, 0.25);
        border-color: #c78b51;
      }
      .btn-gold {
        background-color: #c78b51;
        border-color: #c78b51;
        color: white;
      }
      .btn-gold:hover:not(:disabled) {
        background-color: #b37a44;
        border-color: #b37a44;
        color: white;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  alertMessage = "";
  protected getImageUrl = getImageUrl;
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private apiUserService = inject(ApiUserService);

  private currentUserData: IUserDetails | null = null;
  currentImageUrl: string | null = null; // ← add this
  selectedImage: File | null = null;
  constructor() {
    this.profileForm = this.fb.group({
      displayName: [""],
      firstName: [""],
      lastName: [""],
      phoneNumber: ["", [Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)]],
    });
  }

  ngOnInit() {
    // Check for query params (e.g., from guard)
    this.route.queryParams.subscribe((params) => {
      if (params["message"]) {
        this.alertMessage = params["message"];
      }
    });

    this.loadUserData();
  }

  loadUserData() {
    this.isLoading = true;

    this.apiUserService.getUserDetails().subscribe({
      next: (user) => {
        this.currentUserData = user;
        this.currentImageUrl = user.imagePath ?? null;
        this.profileForm.patchValue({
          displayName: user.displayName ?? "", // ← is this line here?
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          phoneNumber: user.phoneNumber ?? "",
        });

        console.log(user);
        this.isLoading = false;
      },
      error: () => {
        this.toastService.show("Failed to load profile data", "error");
        this.isLoading = false;
      },
    });
  }

  resetForm() {
    if (this.currentUserData) {
      this.profileForm.patchValue({
        firstName: this.currentUserData.firstName ?? "",
        lastName: this.currentUserData.lastName ?? "",

        phoneNumber: this.currentUserData.phoneNumber ?? "",
      });
      this.selectedImage = null;
      this.currentImageUrl = this.currentUserData.imagePath ?? null;
    }
  }

  onImageError() {
    // If the image fails to load (invalid URL), clear it
    this.currentImageUrl = null; // ← clear on broken image
    this.toastService.show("Failed to load image", "error");
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.profileForm.value;

    const updateRequest: IUpdateUserRequest = {
      displayName: formValues.displayName || undefined,
      firstName: formValues.firstName || undefined,
      lastName: formValues.lastName || undefined,
      phoneNumber: formValues.phoneNumber || undefined,
      image: this.selectedImage ?? undefined,
    };

    this.apiUserService.updateUser(updateRequest).subscribe({
      next: () => {
        const nonEmptyValues = Object.fromEntries(
          Object.entries(formValues).filter(([_, v]) => v !== "" && v !== null),
        );

        this.currentUserData = { ...this.currentUserData!, ...nonEmptyValues };

        // handle image separately since it's outside formValues
        if (this.selectedImage) {
          this.currentUserData!.imagePath = this.currentImageUrl ?? undefined;
          this.selectedImage = null;
        }
        this.isSubmitting = false;
        this.alertMessage = "";
        this.toastService.show("Profile updated successfully!", "success");
      },
      error: () => {
        this.isSubmitting = false;
        this.toastService.show("Failed to update profile", "error");
      },
    });
  }
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];

      // preview before upload
      const reader = new FileReader();
      reader.onload = (e) =>
        (this.currentImageUrl = e.target?.result as string);
      reader.readAsDataURL(this.selectedImage);
    }
  }
}

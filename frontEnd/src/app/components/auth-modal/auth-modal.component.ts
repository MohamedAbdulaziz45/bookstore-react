import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiUserService } from "../../services/users/api-user.service";
import { ToastService } from "../../services/toast.service";
import { CartService } from "../../services/cart.service";

type AuthMode = "login" | "signup";

@Component({
  selector: "app-auth-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./auth-modal.component.html",
  styleUrl: "./auth-modal.component.css",
})
export class AuthModalComponent implements AfterViewInit, OnDestroy {
  @Output() loggedIn = new EventEmitter<any>();
  @ViewChild("authModal") modalRef?: ElementRef<HTMLDivElement>;

  authForm: FormGroup;
  private authMode: AuthMode = "login";
  private modalInstance?: { show: () => void; hide: () => void };
  private readonly handleHidden = () => {
    this.zone.run(() => {
      this.setAuthMode("login");
    });
  };

  get isLogin() {
    return this.authMode === "login";
  }

  constructor(
    private fb: FormBuilder,
    public userService: ApiUserService,
    private toastService: ToastService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
  ) {
    this.authForm = fb.group(
      {
        username: [""],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: [""],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngAfterViewInit() {
    const modalElement = this.modalRef?.nativeElement;
    const bootstrapModal = (window as any).bootstrap?.Modal;

    if (!modalElement || !bootstrapModal) return;

    this.modalInstance = bootstrapModal.getOrCreateInstance(modalElement);
    modalElement.addEventListener("hidden.bs.modal", this.handleHidden);
  }

  ngOnDestroy() {
    this.modalRef?.nativeElement.removeEventListener(
      "hidden.bs.modal",
      this.handleHidden,
    );
  }

  open(mode: AuthMode = "login") {
    this.setAuthMode(mode);
    this.modalInstance?.show();
  }

  setLoginMode(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.setAuthMode("login");
  }

  setSignupMode(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.setAuthMode("signup");
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get("password")?.value;
    const confirm = g.get("confirmPassword")?.value;

    if (!confirm) return null;

    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { email, password, username } = this.authForm.value;
    if (this.isLogin) {
      this.userService.login(email, password).subscribe({
        next: (res) => {
          this.userService.saveToken(res.token);
          this.cartService.syncGuestCartAfterLogin();
          console.log(res.token);
          this.closeModal();
          this.loggedIn.emit();
        },
        error: () => {
          this.toastService.show("Invalid email or password", "error");
        },
      });

      return;
    }

    if (!username) {
      this.toastService.show("Username is required", "error");
      return;
    }
    this.userService.registerUser(email, password, username).subscribe({
      next: (res) => {
        this.userService.saveToken(res.token);
        this.cartService.syncGuestCartAfterLogin();
        this.closeModal();
        this.loggedIn.emit();
      },
      error: () => {
        this.toastService.show("Registration failed. Try again.", "error");
      },
    });
  }

  private closeModal() {
    this.modalInstance?.hide();
    this.setAuthMode("login");
  }

  private setAuthMode(mode: AuthMode) {
    this.authMode = mode;
    this.authForm.reset({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    this.authForm.markAsPristine();
    this.authForm.markAsUntouched();
    const confirmPasswordControl = this.authForm.get("confirmPassword");
    if (!confirmPasswordControl) return;

    const displayNameControl = this.authForm.get("username");
    if (!displayNameControl) return;
    if (this.isLogin) {
      confirmPasswordControl.clearValidators();
      displayNameControl?.clearValidators();
    } else {
      confirmPasswordControl.setValidators([Validators.required]);
      displayNameControl?.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]);
    }

    confirmPasswordControl.updateValueAndValidity({ emitEvent: false });
    displayNameControl?.updateValueAndValidity({ emitEvent: false });
    this.authForm.updateValueAndValidity({ emitEvent: false });
    this.cdr.detectChanges();
  }
}

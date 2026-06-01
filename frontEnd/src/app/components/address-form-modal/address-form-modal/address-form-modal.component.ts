import { Component, Input, OnInit } from "@angular/core";
import { IAddress } from "../../../models/Address/iaddress";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-address-form-modal",
  standalone: true,
  imports: [],
  templateUrl: "./address-form-modal.component.html",
  styleUrl: "./address-form-modal.component.scss",
})
export class AddressFormModalComponent implements OnInit {
  @Input() address?: IAddress;

  profileForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.profileForm = fb.group({
      label: ["", [Validators.required, Validators.maxLength(50)]],
      fullName: ["", [Validators.required, Validators.maxLength(150)]],
      phone: ["", [Validators.required, Validators.maxLength(30)]],
      addressLine1: ["", [Validators.required, Validators.maxLength(250)]],
      addressLine2: ["", [Validators.maxLength(250)]],
      city: ["", [Validators.required, Validators.maxLength(100)]],
      state: ["", [Validators.maxLength(100)]],
      postalCode: ["", [Validators.required, Validators.maxLength(20)]],
      country: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      isDefault: [false],
    });
  }
  ngOnInit(): void {
    if (this.address) {
      this.profileForm.patchValue(this.address);
    }
    if (!this.address) {
      this.profileForm.patchValue({
        label: "Home",
        isDefault: true,
      });
    }
  }
}

import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { icategory } from "../../models/icategory";

@Component({
  selector: "app-categories-section",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./categories-section.component.html",
})
export class CategoriesSectionComponent {
  @Input() categories: icategory[] = [];

  toSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

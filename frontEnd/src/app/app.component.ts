import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastComponent } from "./components/toast/toast.component";
import { CartService } from "./services/cart.service";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  `,
})
export class AppComponent implements OnInit {
  title = "book-store-angular";

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.initializeCart();
  }
}

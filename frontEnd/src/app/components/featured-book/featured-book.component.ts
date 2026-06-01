import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-book.component.html'
})
export class FeaturedBookComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() author!: string;
  @Input() description!: string;
  @Input() image!: string;
  @Input() price?: string;
}

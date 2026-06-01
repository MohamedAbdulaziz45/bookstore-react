import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero-section.component.html'
})
export class HeroSectionComponent {
  heroImageUrl = 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=900&h=700&fit=crop&q=80';
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  email = '';
  ok = signal(false);

  socials = [
    { icon: 'bi-facebook',   label: 'Facebook'  },
    { icon: 'bi-twitter-x',  label: 'Twitter'   },
    { icon: 'bi-instagram',  label: 'Instagram' },
    { icon: 'bi-youtube',    label: 'YouTube'   },
  ];

  columns: { heading: string; links: { label: string; path: string }[] }[] = [
    {
      heading: 'Quick Links',
      links: [
        { label: 'Home',         path: '/'           },
        { label: 'All Books',    path: '/all-books'  },
        { label: 'About',        path: '/about'      },
        { label: 'Contact',      path: '/contact'    },
      ]
    },
    {
      heading: 'Explore',
      links: [
        { label: 'Best Sellers',   path: '/best-seller'  },
        { label: "Editor's Pick",  path: '/editors-pick' },
        { label: 'New Arrivals',   path: '/new-arrival'  },
        { label: 'All Books',      path: '/all-books'    },
      ]
    },
    {
      heading: 'Help',
      links: [
        { label: 'Track Order',      path: '#' },
        { label: 'Delivery & Returns', path: '#' },
        { label: 'FAQs',             path: '#' },
        { label: 'Community',        path: '#' },
      ]
    },
  ];

  onSubscribe(e: Event) {
    e.preventDefault();
    if (this.email) { this.ok.set(true); this.email = ''; setTimeout(() => this.ok.set(false), 3500); }
  }
}

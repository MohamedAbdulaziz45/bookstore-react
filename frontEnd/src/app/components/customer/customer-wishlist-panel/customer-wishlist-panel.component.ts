import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-wishlist-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-wishlist-panel.component.html'
})
export class CustomerWishlistPanelComponent {
  wishlistItems = [
    { title: 'Sapiens', author: 'Yuval Noah Harari', price: '$19.99', coverBg: 'var(--brand-warm)' },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', price: '$17.99', coverBg: '#e8f0fe' },
    { title: '1984', author: 'George Orwell', price: '$12.99', coverBg: '#fce4ec' },
    { title: 'The Power of Now', author: 'Eckhart Tolle', price: '$15.99', coverBg: '#e8f5e9' },
    { title: "Man's Search for Meaning", author: 'Viktor Frankl', price: '$13.50', coverBg: '#fff8e1' },
    { title: 'Meditations', author: 'Marcus Aurelius', price: '$11.99', coverBg: '#f3e5f5' },
  ];
}

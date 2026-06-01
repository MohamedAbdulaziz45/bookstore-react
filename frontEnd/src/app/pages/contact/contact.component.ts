import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { PageBannerComponent } from '../../components/page-banner/page-banner.component';
import { NewsletterSectionComponent } from '../../components/newsletter-section/newsletter-section.component';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    HeaderComponent, FooterComponent, PageBannerComponent, NewsletterSectionComponent, CartSidebarComponent],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  form = { name: '', email: '', subject: '', message: '' };
  sent = signal(false);

  socials = [
    { icon: 'bi-facebook',  label: 'Facebook'  },
    { icon: 'bi-twitter-x', label: 'Twitter'   },
    { icon: 'bi-instagram', label: 'Instagram' },
    { icon: 'bi-youtube',   label: 'YouTube'   },
  ];

  contactInfo = [
    { icon: 'bi-geo-alt-fill',   heading: 'Our Location', detail: '1569 2nd Ave, New York, NY 10028, USA' },
    { icon: 'bi-telephone-fill', heading: 'Call Us',       detail: '+39 123 456 7890' },
    { icon: 'bi-envelope-fill',  heading: 'Email',         detail: 'hello@bookworms.com' },
  ];

  onSubmit(e: Event) {
    e.preventDefault();
    this.sent.set(true);
    this.form = { name:'', email:'', subject:'', message:'' };
    setTimeout(() => this.sent.set(false), 5000);
  }
}

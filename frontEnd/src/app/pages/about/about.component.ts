import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { PageBannerComponent } from '../../components/page-banner/page-banner.component';
import { NewsletterSectionComponent } from '../../components/newsletter-section/newsletter-section.component';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent,
    PageBannerComponent, NewsletterSectionComponent, CartSidebarComponent],
  templateUrl: './about.component.html'
})
export class AboutComponent {
  authors = [
    { id:'1', name:'Melissa Miner', role:'Author', image:'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/author-image01.jpg' },
    { id:'2', name:'Steven Moore',  role:'Author', image:'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/author-image02.jpg' },
    { id:'3', name:'Jenny Sanders', role:'Author', image:'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/author-image03.jpg' },
    { id:'4', name:'Andrew Woods',  role:'Author', image:'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/author-image04.jpg' },
  ];

  stats = [
    { num:'10,000+', label:'Books Available' },
    { num:'500+',    label:'Published Authors' },
    { num:'50,000+', label:'Happy Readers' },
    { num:'100+',    label:'Categories' },
  ];

  partnerLogos = [
    'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-4.svg',
    'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-5.svg',
    'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-3.svg',
    'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-2.svg',
    'https://websitedemos.net/book-store-04/wp-content/uploads/sites/1029/2022/02/logoipsum-logo-1.svg',
  ];
}

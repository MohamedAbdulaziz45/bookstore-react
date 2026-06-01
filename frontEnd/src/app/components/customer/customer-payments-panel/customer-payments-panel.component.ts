import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-payments-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-payments-panel.component.html'
})
export class CustomerPaymentsPanelComponent {
  paymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '08/27', holder: 'Sarah Johnson', isDefault: true, icon: 'bi-credit-card-2-front', color: '#0d6efd' },
    { id: 2, type: 'Mastercard', last4: '8531', expiry: '12/26', holder: 'Sarah Johnson', isDefault: false, icon: 'bi-credit-card', color: '#e91e63' },
    { id: 3, type: 'PayPal', last4: '', expiry: '', holder: 'sarah@email.com', isDefault: false, icon: 'bi-paypal', color: '#0070ba' },
  ];
}

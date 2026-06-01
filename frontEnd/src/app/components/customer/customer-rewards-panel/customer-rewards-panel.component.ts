import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-rewards-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-rewards-panel.component.html'
})
export class CustomerRewardsPanelComponent {
  rewardsPoints = 1250;
  rewardsTier = 'Gold';
  nextTier = 'Platinum';
  pointsToNext = 750;

  rewardsHistory = [
    { action: 'Purchase: Atomic Habits', points: '+95', date: 'Mar 4, 2026', type: 'earned' },
    { action: 'Purchase: Deep Work (x2)', points: '+170', date: 'Mar 4, 2026', type: 'earned' },
    { action: 'Redeemed: $5 Coupon', points: '-500', date: 'Feb 25, 2026', type: 'redeemed' },
    { action: 'Review: Atomic Habits', points: '+50', date: 'Feb 15, 2026', type: 'earned' },
    { action: 'Purchase: The Alchemist', points: '+75', date: 'Feb 20, 2026', type: 'earned' },
    { action: 'Review: The Alchemist', points: '+50', date: 'Jan 28, 2026', type: 'earned' },
    { action: 'Sign-up Bonus', points: '+200', date: 'Jan 10, 2025', type: 'earned' },
  ];
}

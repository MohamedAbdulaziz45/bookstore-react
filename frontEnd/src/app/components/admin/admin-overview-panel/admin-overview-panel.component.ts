import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiAdminDashboardService } from '../../../services/admin/api-admin-dashboard.service';
import { AdminDashboardSummary } from '../../../models/admin/admin.models';

@Component({
  selector: 'app-admin-overview-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-overview-panel.component.html',
  styleUrl: './admin-overview-panel.component.scss'
})
export class AdminOverviewPanelComponent implements OnInit {
  summary: AdminDashboardSummary | null = null;
  loading = false;
  error = "";
  chartLabels = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  constructor(private adminDashboardService: ApiAdminDashboardService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.error = "";
    this.adminDashboardService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.loading = false;
      },
      error: () => {
        this.error = "Could not load dashboard summary.";
        this.loading = false;
      },
    });
  }

  get statCards() {
    const summary = this.summary;
    return [
      {
        icon: 'bi-currency-dollar', iconBg: '#fff8e6', iconColor: 'var(--gold)',
        value: this.formatCurrency(summary?.totalRevenue ?? 0), label: 'Total Revenue',
        change: 'Live API total', changeDir: 'up',
        sparkHeights: [40, 60, 45, 80, 100],
        sparkGradient: 'linear-gradient(to top, var(--gold), rgba(225,169,43,.4))'
      },
      {
        icon: 'bi-bag-check', iconBg: '#e8f5e9', iconColor: '#198754',
        value: String(summary?.totalOrders ?? 0), label: 'Total Orders',
        change: 'All order statuses', changeDir: 'up',
        sparkHeights: [50, 70, 55, 90, 75],
        sparkGradient: 'linear-gradient(to top,#198754,rgba(25,135,84,.3))'
      },
      {
        icon: 'bi-people', iconBg: '#e3f2fd', iconColor: '#0d6efd',
        value: String(summary?.totalCustomers ?? 0), label: 'Total Customers',
        change: 'Active customers', changeDir: 'up',
        sparkHeights: [30, 55, 40, 70, 85],
        sparkGradient: 'linear-gradient(to top,#0d6efd,rgba(13,110,253,.3))'
      },
      {
        icon: 'bi-book', iconBg: '#fce4ec', iconColor: '#e91e63',
        value: String(summary?.totalBooks ?? 0), label: 'Books',
        change: `${summary?.lowStockBooks.length ?? 0} low stock alerts`, changeDir: 'down',
        sparkHeights: [60, 80, 65, 45, 90],
        sparkGradient: 'linear-gradient(to top,#e91e63,rgba(233,30,99,.3))'
      },
    ];
  }

  chartHeight(label: string): number {
    const breakdown = this.summary?.orderStatusBreakdown ?? {};
    const max = Math.max(...Object.values(breakdown), 1);
    return ((breakdown[label] ?? 0) / max) * 100;
  }

  getChartTooltip(height: number): string {
    return `${Math.round(height)}%`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
  }

  statusClass(status: string): string {
    return status.toLowerCase();
  }
}

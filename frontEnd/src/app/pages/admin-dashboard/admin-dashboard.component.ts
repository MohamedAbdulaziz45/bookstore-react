import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AdminSidebarComponent } from '../../components/admin/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../../components/admin/admin-topbar/admin-topbar.component';
import { AdminOverviewPanelComponent } from '../../components/admin/admin-overview-panel/admin-overview-panel.component';
import { AdminBooksPanelComponent } from '../../components/admin/admin-books-panel/admin-books-panel.component';
import { AdminGenresPanelComponent } from '../../components/admin/admin-genres-panel/admin-genres-panel.component';
import { AdminAuthorsPanelComponent } from '../../components/admin/admin-authors-panel/admin-authors-panel.component';
import { AdminOrdersPanelComponent } from '../../components/admin/admin-orders-panel/admin-orders-panel.component';
import { AdminPaymentsPanelComponent } from '../../components/admin/admin-payments-panel/admin-payments-panel.component';
import { AdminShippingsPanelComponent } from '../../components/admin/admin-shippings-panel/admin-shippings-panel.component';
import { AdminCustomersPanelComponent } from '../../components/admin/admin-customers-panel/admin-customers-panel.component';
import { AdminReviewsPanelComponent } from '../../components/admin/admin-reviews-panel/admin-reviews-panel.component';
import { AdminSettingsPanelComponent } from '../../components/admin/admin-settings-panel/admin-settings-panel.component';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        AdminSidebarComponent,
        AdminTopbarComponent,
        AdminOverviewPanelComponent,
        AdminBooksPanelComponent,
        AdminGenresPanelComponent,
        AdminAuthorsPanelComponent,
        AdminOrdersPanelComponent,
        AdminPaymentsPanelComponent,
        AdminShippingsPanelComponent,
        AdminCustomersPanelComponent,
        AdminReviewsPanelComponent,
        AdminSettingsPanelComponent
    ],
    templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    activeTab: AdminDashboardTab = 'overview';
    private routeSub?: Subscription;

    readonly validTabs: AdminDashboardTab[] = [
        'overview',
        'books',
        'genres',
        'authors',
        'orders',
        'payments',
        'shippings',
        'customers',
        'reviews',
        'settings',
    ];

    panelTitles: Record<AdminDashboardTab, [string, string]> = {
        overview: ['Dashboard Overview', new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })],
        books: ['Books Management', 'Catalogue'],
        genres: ['Genres Management', 'Catalogue'],
        authors: ['Authors Management', 'Catalogue'],
        orders: ['Orders Management', 'Sales'],
        payments: ['Payments', 'Sales'],
        shippings: ['Shippings', 'Sales'],
        customers: ['Customers', 'Community'],
        reviews: ['Reviews', 'Community'],
        settings: ['Settings', 'System'],
    };

    topbarTitle = 'Dashboard Overview';
    topbarSub = this.panelTitles.overview[1];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.routeSub = this.route.queryParamMap.subscribe((params) => {
            const tab = params.get('tab');
            const nextTab = this.isValidTab(tab) ? tab : 'overview';
            this.setActiveTab(nextTab);

            if (tab !== nextTab) {
                void this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { tab: nextTab },
                    queryParamsHandling: 'merge',
                    replaceUrl: true,
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.routeSub?.unsubscribe();
    }

    showTab(tabId: string) {
        if (!this.isValidTab(tabId)) return;
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { tab: tabId },
            queryParamsHandling: 'merge',
        });
    }

    private setActiveTab(tabId: AdminDashboardTab): void {
        this.activeTab = tabId;
        this.topbarTitle = this.panelTitles[tabId][0];
        this.topbarSub = this.panelTitles[tabId][1];
    }

    private isValidTab(tab: string | null): tab is AdminDashboardTab {
        return !!tab && this.validTabs.includes(tab as AdminDashboardTab);
    }
}

type AdminDashboardTab =
    | 'overview'
    | 'books'
    | 'genres'
    | 'authors'
    | 'orders'
    | 'payments'
    | 'shippings'
    | 'customers'
    | 'reviews'
    | 'settings';

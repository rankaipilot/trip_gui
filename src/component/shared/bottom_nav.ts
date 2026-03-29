import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface BottomTab {
  icon: string;
  label: string;
  route: string;
}

export const RIDER_TABS: BottomTab[] = [
  { icon: 'home', label: 'Home', route: '/rider/home' },
  { icon: 'schedule', label: 'Upcoming', route: '/rider/upcoming' },
  { icon: 'receipt_long', label: 'Activity', route: '/rider/activity' },
  { icon: 'person', label: 'Account', route: '/rider/account' },
];

export const DRIVER_TABS: BottomTab[] = [
  { icon: 'home', label: 'Home', route: '/driver/home' },
  { icon: 'trending_up', label: 'Earn more', route: '/driver/earn' },
  { icon: 'directions_car', label: 'Rides', route: '/driver/rides' },
  { icon: 'help', label: 'Help', route: '/driver/help' },
];

@Component({
  selector: 'bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatIconModule],
  template: `
    <nav class="bottom-nav" aria-label="Main navigation">
      @for (tab of tabs(); track tab.route) {
        <a class="bottom-nav-tab"
           [routerLink]="tab.route"
           routerLinkActive="active"
           [attr.aria-label]="tab.label">
          <mat-icon>{{ tab.icon }}</mat-icon>
          <span class="bottom-nav-label">{{ tab.label }}</span>
        </a>
      }
    </nav>
  `,
  styles: `
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 430px;
      height: 64px;
      background: var(--trip-surface);
      border-top: 1px solid var(--trip-border);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 1000;
      padding-bottom: env(safe-area-inset-bottom, 0);
    }

    .bottom-nav-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-decoration: none;
      color: var(--trip-on-surface-variant);
      font-size: 11px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 8px;
      transition: color 0.2s;
    }

    .bottom-nav-tab.active {
      color: var(--trip-primary);
    }

    .bottom-nav-label {
      line-height: 1;
    }
  `,
})
export class BottomNav {
  readonly tabs = input.required<BottomTab[]>();
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rider-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="rider-home">
      <div class="map-area" role="img" aria-label="Map showing your current location">
        <div class="map-placeholder">
          <mat-icon class="map-icon">map</mat-icon>
        </div>
        <button mat-icon-button class="notification-btn" aria-label="Notifications">
          <mat-icon>notifications</mat-icon>
        </button>
      </div>

      <div class="search-area">
        <button class="search-bar" (click)="navigateToBooking()">
          <mat-icon>search</mat-icon>
          <span>Where to?</span>
        </button>

        <div class="quick-actions">
          <button class="quick-btn" (click)="navigateToBooking()">
            <mat-icon>home</mat-icon>
            <span>Home</span>
          </button>
          <button class="quick-btn" (click)="navigateToBooking()">
            <mat-icon>work</mat-icon>
            <span>Work</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .rider-home {
      display: flex;
      flex-direction: column;
      height: calc(100dvh - 64px);
    }

    .map-area {
      flex: 1;
      position: relative;
    }

    .map-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--trip-surface-variant);
    }

    .map-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--trip-on-surface-hint);
    }

    .notification-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--trip-surface);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .search-area {
      padding: 16px;
      background: var(--trip-surface);
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 16px;
      border: none;
      border-radius: 24px;
      background: var(--trip-surface-variant);
      font-size: 16px;
      color: var(--trip-on-surface-variant);
      cursor: pointer;
      text-align: left;
    }

    .quick-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .quick-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border: 1px solid var(--trip-border);
      border-radius: 20px;
      background: var(--trip-surface);
      font-size: 14px;
      font-weight: 500;
      color: var(--trip-on-surface);
      cursor: pointer;
    }

    .quick-btn:hover {
      background: var(--trip-surface-variant);
    }
  `,
})
export class RiderHomeComponent {
  private readonly router = inject(Router);

  navigateToBooking() {
    this.router.navigate(['/rider/book']);
  }
}

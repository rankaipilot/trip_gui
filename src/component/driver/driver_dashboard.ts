import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DriverService } from 'service/driver.service';

@Component({
  selector: 'driver-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="driver-home">
      <div class="map-area" role="img" aria-label="Map showing driver location">
        <div class="map-placeholder">
          <mat-icon class="map-icon">map</mat-icon>
        </div>
      </div>

      <div class="status-area">
        <div class="status-banner" [class.online]="isOnline()">
          @if (isOnline()) {
            <p class="status-text">You are online</p>
            <div class="earnings-row">
              <span class="earnings">Today: $0.00</span>
              <span class="trips">0 trips</span>
            </div>
          } @else {
            <p class="status-text">You're approved!</p>
            <p class="status-sub">Go online to start driving</p>
          }
        </div>

        <button class="toggle-btn" [class.online]="isOnline()" (click)="toggleOnline()">
          {{ isOnline() ? 'Go offline' : 'Go online' }}
        </button>
      </div>
    </div>
  `,
  styles: `
    .driver-home {
      display: flex;
      flex-direction: column;
      height: calc(100dvh - 64px);
    }

    .map-area {
      flex: 1;
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

    .status-area {
      padding: 16px;
      background: var(--trip-surface);
    }

    .status-banner {
      text-align: center;
      padding: 16px;
      border-radius: 12px;
      background: var(--trip-surface-variant);
      margin-bottom: 12px;
    }

    .status-banner.online {
      background: var(--trip-success-light);
    }

    .status-text {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--trip-on-surface);
    }

    .status-sub {
      margin: 4px 0 0;
      font-size: 14px;
      color: var(--trip-on-surface-variant);
    }

    .earnings-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 8px;
      font-size: 14px;
      color: var(--trip-on-surface-variant);
    }

    .toggle-btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      background: var(--trip-primary);
      color: white;
      transition: background 0.2s;
    }

    .toggle-btn.online {
      background: var(--trip-on-surface-variant);
    }
  `,
})
export class DriverDashboardComponent {
  private readonly driverService = inject(DriverService);
  readonly isOnline = signal(false);

  toggleOnline() {
    const newState = !this.isOnline();
    this.isOnline.set(newState);
    this.driverService.setOnlineStatus(newState, { lat: 0, lng: 0 }).subscribe();
  }
}

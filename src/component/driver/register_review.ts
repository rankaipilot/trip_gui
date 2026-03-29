import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'driver-register-review',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="review-screen">
      <div class="trvoo-logo">TRVOO</div>

      <mat-icon class="review-icon">hourglass_top</mat-icon>

      <h1 class="review-title">Almost there!</h1>
      <p class="review-msg">We're reviewing your application.</p>
      <p class="review-msg">Notified within 3 days.</p>

      <button mat-flat-button class="pill-btn primary-btn" (click)="openApp()">
        Open the app
      </button>
    </div>
  `,
  styles: `
    .review-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 48px 24px;
      text-align: center;
    }

    .trvoo-logo {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 3px;
      color: var(--trip-primary);
      margin-bottom: 32px;
    }

    .review-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--trip-secondary);
      margin-bottom: 24px;
    }

    .review-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 12px;
    }

    .review-msg {
      font-size: 16px;
      color: var(--trip-on-surface-variant);
      margin: 2px 0;
    }

    .pill-btn {
      border-radius: 24px;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      width: 100%;
      max-width: 280px;
      margin-top: 40px;
    }

    .primary-btn {
      background: var(--trip-primary);
      color: white;
    }
  `,
})
export class DriverRegisterReview {
  private readonly router = inject(Router);

  openApp() {
    this.router.navigate(['/driver/home']);
  }
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MobileShell } from 'component/shared/mobile_shell';

@Component({
  selector: 'public-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileShell, MatButtonModule, RouterLink],
  template: `
    <mobile-shell>
      <div class="public-screen">
        <div class="public-hero">
          <div class="trvoo-logo" aria-label="TRVOO">TRVOO</div>
          <p class="tagline-1">{{ tagline1() }}</p>
          <p class="tagline-2">{{ tagline2() }}</p>
          @if (tagline3()) {
            <p class="tagline-2">{{ tagline3() }}</p>
          }
        </div>

        <div class="public-actions">
          <a mat-flat-button class="pill-btn primary-btn" [routerLink]="'/login/' + role()">
            Sign in
          </a>
          <a mat-stroked-button class="pill-btn" [routerLink]="'/register/' + role()">
            Register
          </a>
        </div>
      </div>
    </mobile-shell>
  `,
  styles: `
    .public-screen {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    .public-hero {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      background: var(--trip-gradient-subtle);
    }

    .trvoo-logo {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: 4px;
      color: var(--trip-primary);
      margin-bottom: 32px;
    }

    .tagline-1 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: var(--trip-on-surface);
      text-align: center;
    }

    .tagline-2 {
      margin: 4px 0 0;
      font-size: 16px;
      color: var(--trip-on-surface-variant);
      text-align: center;
    }

    .public-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 32px 24px 48px;
    }

    .pill-btn {
      border-radius: 24px;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    }

    .primary-btn {
      background: var(--trip-primary);
      color: white;
    }
  `,
})
export class PublicScreen {
  readonly role = input('rider');

  readonly tagline1 = computed(() =>
    this.role() === 'driver' ? 'Drive with TRVOO' : 'Your ride, your experience',
  );

  readonly tagline2 = computed(() =>
    this.role() === 'driver'
      ? 'Have fun and earn more money.'
      : 'Book rides that match',
  );

  readonly tagline3 = computed(() =>
    this.role() === 'driver' ? '' : 'your mood and moment.',
  );
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mobile-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mobile-shell-bg">
      <div class="mobile-shell">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .mobile-shell-bg {
      min-height: 100dvh;
      background: var(--trip-primary-dark);
    }

    .mobile-shell {
      position: relative;
      max-width: 430px;
      min-height: 100dvh;
      margin: 0 auto;
      background: var(--trip-surface);
      overflow-x: hidden;
    }

    @media (min-width: 431px) {
      .mobile-shell {
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
      }
    }
  `,
})
export class MobileShell {}

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MobileShell } from 'component/shared/mobile_shell';
import { BottomNav, DRIVER_TABS } from 'component/shared/bottom_nav';

@Component({
  selector: 'driver-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileShell, BottomNav, RouterOutlet],
  template: `
    <mobile-shell>
      <div class="driver-content" [class.has-bottom-nav]="showNav()">
        <router-outlet />
      </div>
      @if (showNav()) {
        <bottom-nav [tabs]="tabs" />
      }
    </mobile-shell>
  `,
  styles: `
    .driver-content.has-bottom-nav {
      padding-bottom: 72px;
    }
  `,
})
export class DriverShell {
  readonly tabs = DRIVER_TABS;
  private readonly router = inject(Router);

  readonly showNav = computed(() => !this.router.url.includes('/setup/'));
}

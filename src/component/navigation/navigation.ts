import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ApplicationMenu, ApplicationMenuItem } from 'model/tripdb';
import { AuthService } from 'service/auth.service';
import { NotificationCenter } from 'component/shared/notification_center';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterModule,
    MatExpansionModule,
    NotificationCenter,
    NgOptimizedImage,
  ],
})
export class Navigation implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly allMenuItems = signal<ApplicationMenu[]>([]);

  readonly menuItems = computed(() => {
    const menus = this.allMenuItems();
    return menus
      .map(menu => ({
        ...menu,
        ApplicationMenuItems: (menu.ApplicationMenuItems ?? [])
          .filter(item => item.ItemId && this.authService.canAccess(item.ItemId)),
      }))
      .filter(menu => (menu.ApplicationMenuItems?.length ?? 0) > 0);
  });

  readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  readonly isLoggedIn = this.authService.isLoggedIn;

  ngOnInit() {
    this.authService.loadStoredSession();
    this.authService.getMenus().subscribe((menuItems: ApplicationMenu[]) => { this.allMenuItems.set(menuItems); });
  }

  logout() {
    this.authService.logout();
  }

  getRouterLink(item: ApplicationMenuItem): string {
    return '/' + (item.MenuId ?? '').toLowerCase() + '/' + (item.ItemId ?? '');
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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

  menuItems = signal<ApplicationMenu[]>([]);

  readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  get isLoggedIn(): boolean {
    return this.authService.token !== null;
  }

  ngOnInit() {
    this.authService.loadStoredSession();
    this.authService.getMenus().subscribe((menuItems) => { this.menuItems.set(menuItems); });
  }

  logout() {
    this.authService.logout();
  }

  getRouterLink(item: ApplicationMenuItem): string {
    return '/' + (item.MenuId ?? '').toLowerCase() + '/' + (item.ItemId ?? '');
  }
}

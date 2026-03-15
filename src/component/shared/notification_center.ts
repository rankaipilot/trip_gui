import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from 'service/notification.service';

@Component({
    selector: 'notification-center',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule],
    template: `
        <button mat-icon-button [matMenuTriggerFor]="notifMenu" aria-label="Notifications"
                [matBadge]="unreadCount()" [matBadgeHidden]="unreadCount() === 0" matBadgeColor="warn" matBadgeSize="small">
            <mat-icon>notifications</mat-icon>
        </button>
        <mat-menu #notifMenu="matMenu" class="notification-menu">
            <div class="notif-header" (click)="$event.stopPropagation()">
                <span>Notifications</span>
                @if (unreadCount() > 0) {
                    <button mat-button (click)="markAllRead()">Mark all read</button>
                }
            </div>
            @for (notif of notifications(); track notif.id) {
                <button mat-menu-item>
                    <mat-icon>{{ notif.icon }}</mat-icon>
                    <span>{{ notif.title }}</span>
                </button>
            }
            @if (notifications().length === 0) {
                <div class="notif-empty" (click)="$event.stopPropagation()">You're all caught up</div>
            }
        </mat-menu>
    `,
    styles: [`
        .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; font-weight: 600; }
        .notif-empty { padding: 24px; text-align: center; color: var(--trip-on-surface-variant); }
    `],
})
export class NotificationCenter {
    private readonly notifService = inject(NotificationService);
    readonly notifications = signal<any[]>([]);
    readonly unreadCount = signal(0);

    markAllRead() {
        this.notifService.markAllRead().subscribe(() => this.unreadCount.set(0));
    }
}

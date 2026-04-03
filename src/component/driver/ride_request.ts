import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CountdownTimer } from 'component/shared/countdown_timer';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'ride-request',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatIconModule, CountdownTimer, CurrencyPipe],
    template: `
        <mat-card class="ride-request-card">
            <mat-card-header><mat-card-title>New Ride Request</mat-card-title></mat-card-header>
            <mat-card-content>
                <p><mat-icon>place</mat-icon> {{ pickupAddress() }}</p>
                <p><strong>{{ estimatedFare() | currency }}</strong></p>
                <countdown-timer [seconds]="15" (onExpire)="decline.emit()" />
            </mat-card-content>
            <mat-card-actions>
                <button mat-raised-button class="primary" (click)="accept.emit()">Accept</button>
                <button mat-button (click)="decline.emit()">Decline</button>
            </mat-card-actions>
        </mat-card>
    `,
    styles: [`
        .ride-request-card { position: fixed; bottom: 0; left: 0; right: 0; z-index: 200; margin: 16px; }
    `],
})
export class RideRequestComponent {
    readonly pickupAddress = input('');
    readonly estimatedFare = input(0);
    readonly accept = output<void>();
    readonly decline = output<void>();
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'driver-earnings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Earnings</h2>
            <div class="kpi-grid">
                <mat-card><mat-card-content><h3>$0.00</h3><p>This Week</p></mat-card-content></mat-card>
                <mat-card><mat-card-content><h3>0</h3><p>Trips</p></mat-card-content></mat-card>
                <mat-card><mat-card-content><h3>$0.00</h3><p>Tips</p></mat-card-content></mat-card>
            </div>
            <h3>Payout History</h3>
            <p class="status-text">No payouts yet.</p>
        </div>
    `,
})
export class DriverEarningsComponent {}

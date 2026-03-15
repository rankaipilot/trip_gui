import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'admin-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Admin Dashboard</h2>
            <div class="kpi-grid">
                <mat-card><mat-card-content><mat-icon>people</mat-icon><h3>0</h3><p>Active Riders</p></mat-card-content></mat-card>
                <mat-card><mat-card-content><mat-icon>local_taxi</mat-icon><h3>0</h3><p>Online Drivers</p></mat-card-content></mat-card>
                <mat-card><mat-card-content><mat-icon>directions_car</mat-icon><h3>0</h3><p>Active Rides</p></mat-card-content></mat-card>
                <mat-card><mat-card-content><mat-icon>payments</mat-icon><h3>$0</h3><p>Revenue Today</p></mat-card-content></mat-card>
                <mat-card><mat-card-content><mat-icon>check_circle</mat-icon><h3>0%</h3><p>Completion Rate</p></mat-card-content></mat-card>
                <mat-card><mat-card-content><mat-icon>schedule</mat-icon><h3>0 min</h3><p>Avg Wait Time</p></mat-card-content></mat-card>
            </div>
        </div>
    `,
})
export class AdminDashboardComponent {}

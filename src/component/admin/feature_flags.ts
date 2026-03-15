import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'feature-flags',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatSlideToggleModule],
    template: `
        <div class="page-container">
            <h2>Feature Flags</h2>
            <mat-card style="margin-bottom:8px;"><mat-card-content><mat-slide-toggle>Split Fare</mat-slide-toggle></mat-card-content></mat-card>
            <mat-card style="margin-bottom:8px;"><mat-card-content><mat-slide-toggle>Scheduled Rides</mat-slide-toggle></mat-card-content></mat-card>
            <mat-card style="margin-bottom:8px;"><mat-card-content><mat-slide-toggle>Pool Rides</mat-slide-toggle></mat-card-content></mat-card>
            <mat-card style="margin-bottom:8px;"><mat-card-content><mat-slide-toggle>Promotions</mat-slide-toggle></mat-card-content></mat-card>
        </div>
    `,
})
export class FeatureFlagsComponent {}

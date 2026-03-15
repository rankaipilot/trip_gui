import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'ride-monitor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Ride Monitor</h2>
            <div class="map-container" role="img" aria-label="Live ride monitoring map">
                <div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--trip-surface-variant);">
                    <mat-icon style="font-size:48px;width:48px;height:48px;">map</mat-icon>
                    <p>Real-time ride map</p>
                </div>
            </div>
        </div>
    `,
})
export class RideMonitorComponent {}

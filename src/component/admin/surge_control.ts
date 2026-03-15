import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'surge-control',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Surge Control</h2>
            <div class="map-container" role="img" aria-label="Surge zone map">
                <div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--trip-surface-variant);">
                    <mat-icon style="font-size:48px;width:48px;height:48px;">trending_up</mat-icon>
                    <p>Surge zone visualization</p>
                </div>
            </div>
        </div>
    `,
})
export class SurgeControlComponent {}

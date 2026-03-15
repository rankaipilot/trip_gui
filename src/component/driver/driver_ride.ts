import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RideStateStore } from 'service/ride_state.store';
import { RideStateChip } from 'component/shared/ride_state_chip';

@Component({
    selector: 'driver-ride',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatIconModule, RideStateChip],
    template: `
        <div class="page-container">
            <div class="map-container" role="img" aria-label="Navigation map">
                <div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--trip-surface-variant);">
                    <mat-icon style="font-size:48px;width:48px;height:48px;">navigation</mat-icon>
                </div>
            </div>
            <mat-card style="margin-top:16px;">
                <mat-card-content>
                    <ride-state-chip [state]="rideStore.rideState()" />
                    @switch (rideStore.rideState()) {
                        @case ('E') {
                            <p>Navigating to pickup...</p>
                            <button mat-raised-button color="primary">Arrived at Pickup</button>
                        }
                        @case ('A') {
                            <p>Waiting for rider...</p>
                            <button mat-raised-button color="primary">Start Trip</button>
                        }
                        @case ('I') {
                            <p>Trip in progress</p>
                            <button mat-raised-button color="primary">Complete Trip</button>
                        }
                    }
                </mat-card-content>
            </mat-card>
        </div>
    `,
})
export class DriverRideComponent {
    readonly rideStore = inject(RideStateStore);
}

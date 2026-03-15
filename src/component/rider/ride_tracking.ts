import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RideStateStore } from 'service/ride_state.store';
import { TrackingService } from 'service/tracking.service';
import { RideStateChip } from 'component/shared/ride_state_chip';
import { CountdownTimer } from 'component/shared/countdown_timer';

@Component({
    selector: 'ride-tracking',
    templateUrl: './ride_tracking.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatIconModule, RideStateChip, CountdownTimer],
})
export class RideTrackingComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    readonly rideStore = inject(RideStateStore);
    private readonly tracking = inject(TrackingService);
    private rideId = '';

    ngOnInit() {
        this.rideId = this.route.snapshot.params['id'] ?? '';
        this.tracking.connect();
        if (this.rideId) {
            this.tracking.subscribe(this.rideId);
            this.tracking.onMessage((event) => {
                if (event.type === 'driver_location' && event.lat && event.lng) {
                    this.rideStore.driverLocation.set({ lat: event.lat, lng: event.lng });
                }
                if (event.type === 'eta_update' && event.eta_seconds !== undefined) {
                    this.rideStore.etaSeconds.set(event.eta_seconds);
                }
                if (event.type === 'ride_status_changed' && event.new_status) {
                    this.rideStore.rideState.set(event.new_status);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.rideId) this.tracking.unsubscribe(this.rideId);
        this.tracking.disconnect();
    }
}

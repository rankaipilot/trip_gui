import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RideService } from 'service/ride.service';
import { RideStateStore } from 'service/ride_state.store';
import { RideTypeCard } from 'component/shared/ride_type_card';
import { FareBreakdown } from 'component/shared/fare_breakdown';
import { FareEstimate } from 'model/ride_state';

@Component({
    selector: 'ride-booking',
    templateUrl: './ride_booking.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, RideTypeCard, FareBreakdown],
})
export class RideBookingComponent {
    private readonly rideService = inject(RideService);
    private readonly rideStore = inject(RideStateStore);
    private readonly router = inject(Router);

    readonly pickupAddress = signal('');
    readonly dropoffAddress = signal('');
    readonly selectedRideType = signal('E');
    readonly estimates = signal<FareEstimate[]>([]);
    readonly rideTypes = ['E', 'P', 'X', 'O', 'A', 'R', 'W'];

    selectRideType(type: string) {
        this.selectedRideType.set(type);
        this.rideStore.selectedRideType.set(type);
    }

    getEstimate(type: string): FareEstimate | undefined {
        return this.estimates().find(e => e.rideType === type);
    }

    selectedEstimate() {
        return this.getEstimate(this.selectedRideType());
    }

    confirmBooking() {
        // TODO: integrate with actual map coordinates
    }
}

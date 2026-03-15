import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RideService } from 'service/ride.service';
import { Ride } from 'model/tripdb';
import { RideStateChip } from 'component/shared/ride_state_chip';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RideStatus } from 'model/ride_state';

@Component({
    selector: 'ride-history',
    templateUrl: './ride_history.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatIconModule, RideStateChip, CurrencyPipe, DatePipe],
})
export class RideHistoryComponent implements OnInit {
    private readonly rideService = inject(RideService);
    readonly rides = signal<Ride[]>([]);

    ngOnInit() {
        this.rideService.getMyRides().subscribe((rides) => this.rides.set(rides));
    }

    asRideStatus(status: string | undefined): RideStatus {
        return (status as RideStatus) ?? 'IDLE';
    }
}

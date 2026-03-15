import { computed, Injectable, signal } from '@angular/core';
import { FareEstimate, LatLng, RideStatus } from 'model/ride_state';
import { Ride } from 'model/tripdb';

@Injectable({ providedIn: 'root' })
export class RideStateStore {
  readonly rideState = signal<RideStatus>('IDLE');
  readonly activeRide = signal<Ride | null>(null);
  readonly driverLocation = signal<LatLng | null>(null);
  readonly etaSeconds = signal<number>(0);
  readonly distanceRemainingM = signal<number>(0);
  readonly fareEstimate = signal<FareEstimate | null>(null);
  readonly selectedRideType = signal<string>('E');
  readonly surgeMultiplier = signal<number>(1.0);

  readonly isActiveRide = computed(() =>
    ['Q', 'M', 'E', 'A', 'I'].includes(this.rideState())
  );
  readonly canCancel = computed(() =>
    ['Q', 'M', 'E', 'A'].includes(this.rideState())
  );
  readonly showSOS = computed(() =>
    ['A', 'I'].includes(this.rideState())
  );
  readonly etaDisplay = computed(() => {
    const s = this.etaSeconds();
    return s > 60 ? `${Math.ceil(s / 60)} min` : `${s}s`;
  });
}

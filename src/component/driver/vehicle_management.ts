import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DriverService } from 'service/driver.service';
import { Vehicle } from 'model/tripdb';

@Component({
    selector: 'vehicle-management',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Vehicles</h2>
            <button mat-raised-button color="accent" style="margin-bottom:16px;"><mat-icon>add</mat-icon> Add Vehicle</button>
            @for (v of vehicles(); track v.VehicleId) {
                <mat-card style="margin-bottom:8px;">
                    <mat-card-content>
                        <strong>{{ v.Year }} {{ v.Make }} {{ v.Model }}</strong> — {{ v.Color }} — {{ v.LicensePlate }}
                    </mat-card-content>
                </mat-card>
            }
            @if (vehicles().length === 0) {
                <p class="status-text">No vehicles registered.</p>
            }
        </div>
    `,
})
export class VehicleManagementComponent implements OnInit {
    private readonly driverService = inject(DriverService);
    readonly vehicles = signal<Vehicle[]>([]);

    ngOnInit() {
        this.driverService.getVehicles().subscribe((v) => this.vehicles.set(v));
    }
}

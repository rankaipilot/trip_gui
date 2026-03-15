import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DriverService } from 'service/driver.service';

@Component({
    selector: 'driver-dashboard',
    templateUrl: './driver_dashboard.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatIconModule, MatSlideToggleModule],
})
export class DriverDashboardComponent {
    private readonly driverService = inject(DriverService);
    readonly isOnline = signal(false);

    toggleOnline() {
        const newState = !this.isOnline();
        this.isOnline.set(newState);
        this.driverService.setOnlineStatus(newState, { lat: 0, lng: 0 }).subscribe();
    }
}

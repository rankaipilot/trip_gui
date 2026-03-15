import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'scheduled-rides',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Scheduled Rides</h2>
            <button mat-raised-button color="accent"><mat-icon>add</mat-icon> Schedule a Ride</button>
            <p class="status-text" style="margin-top:24px;">No scheduled rides.</p>
        </div>
    `,
})
export class ScheduledRidesComponent {}

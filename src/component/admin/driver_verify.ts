import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'driver-verify',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule],
    template: `
        <div class="page-container">
            <h2>Driver Verification Queue</h2>
            <p class="status-text">No drivers pending verification.</p>
        </div>
    `,
})
export class DriverVerifyComponent {}

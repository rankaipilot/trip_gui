import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'driver-profile',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Driver Profile</h2>
            <mat-card style="margin-bottom:16px;">
                <mat-card-content>
                    <h3>Documents</h3>
                    <button mat-raised-button color="accent"><mat-icon>upload</mat-icon> Upload Document</button>
                </mat-card-content>
            </mat-card>
            <mat-card>
                <mat-card-content>
                    <h3>Banking Information</h3>
                    <p class="status-text">No bank account configured.</p>
                </mat-card-content>
            </mat-card>
        </div>
    `,
})
export class DriverProfileComponent {}

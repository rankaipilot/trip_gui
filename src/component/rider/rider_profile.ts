import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'rider-profile',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
    template: `
        <div class="page-container">
            <h2>Profile</h2>
            <mat-card>
                <mat-card-content>
                    <div class="form-container">
                        <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput></mat-form-field>
                        <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput></mat-form-field>
                        <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" readonly></mat-form-field>
                        <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput type="tel"></mat-form-field>
                    </div>
                    <button mat-raised-button color="primary" style="margin-top:16px;">Save Changes</button>
                </mat-card-content>
            </mat-card>
        </div>
    `,
})
export class RiderProfileComponent {}

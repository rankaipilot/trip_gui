import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dash-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, NgOptimizedImage],
  template: `
    <div class="page-container">
        <div class="gradient-hero" style="border-radius: 16px; margin-bottom: 24px;">
            <img ngSrc="trip_logo.png" alt="TRIPMAN" width="64" height="64" priority>
            <h1>Welcome to TRIPMAN</h1>
            <p>Your ride, your way</p>
        </div>
        <div class="kpi-grid">
            <mat-card>
                <mat-card-content>
                    <mat-icon>directions_car</mat-icon>
                    <h3>Book a Ride</h3>
                    <p>Request a ride in seconds</p>
                </mat-card-content>
            </mat-card>
            <mat-card>
                <mat-card-content>
                    <mat-icon>history</mat-icon>
                    <h3>Ride History</h3>
                    <p>View past trips and receipts</p>
                </mat-card-content>
            </mat-card>
            <mat-card>
                <mat-card-content>
                    <mat-icon>payments</mat-icon>
                    <h3>Payments</h3>
                    <p>Manage payment methods</p>
                </mat-card-content>
            </mat-card>
            <mat-card>
                <mat-card-content>
                    <mat-icon>support_agent</mat-icon>
                    <h3>Support</h3>
                    <p>Get help with your account</p>
                </mat-card-content>
            </mat-card>
        </div>
    </div>
  `,
})
export class DashUser {}

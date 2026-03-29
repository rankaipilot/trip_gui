import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { RegistrationService } from 'service/registration.service';

@Component({
  selector: 'rider-register-locations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TrvooHeader, ReactiveFormsModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
  ],
  template: `
    <trvoo-header title="Favorite Locations" />

    <div class="setup-content">
      <p class="setup-info">Save your frequent locations for quick booking</p>

      <form [formGroup]="form">
        <div class="location-group">
          <mat-icon class="location-icon">home</mat-icon>
          <h3 class="location-label">Home</h3>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Enter home address</mat-label>
          <input matInput formControlName="homeAddress">
        </mat-form-field>

        <div class="location-group">
          <mat-icon class="location-icon">work</mat-icon>
          <h3 class="location-label">Work</h3>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Enter work address</mat-label>
          <input matInput formControlName="workAddress">
        </mat-form-field>
      </form>

      <button mat-button class="skip-link" (click)="done()">Skip for now</button>
      <button mat-flat-button class="pill-btn primary-btn" (click)="done()">
        Done
      </button>
    </div>
  `,
  styles: `
    .setup-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 24px 32px;
    }

    .setup-info {
      font-size: 15px;
      color: var(--trip-on-surface-variant);
      margin: 0 0 16px;
    }

    .location-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0 4px;
    }

    .location-icon {
      color: var(--trip-primary);
    }

    .location-label {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .full-width { width: 100%; }

    .pill-btn {
      border-radius: 24px;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      width: 100%;
    }

    .primary-btn {
      background: var(--trip-primary);
      color: white;
    }

    .skip-link {
      align-self: center;
      color: var(--trip-on-surface-variant);
    }
  `,
})
export class RiderRegisterLocations {
  private readonly regService = inject(RegistrationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    homeAddress: [''],
    workAddress: [''],
  });

  done() {
    this.regService.submitRiderRegistration().subscribe({
      next: () => this.router.navigate(['/rider/home']),
      error: () => this.router.navigate(['/rider/home']),
    });
  }
}

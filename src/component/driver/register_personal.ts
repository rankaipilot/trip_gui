import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { RegistrationService } from 'service/registration.service';

@Component({
  selector: 'driver-register-personal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TrvooHeader, ReactiveFormsModule, MatButtonModule, MatCheckboxModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  template: `
    <trvoo-header title="Personal Information" />

    <div class="setup-content">
      <p class="setup-info">Only first name and vehicle details visible to clients</p>

      <form [formGroup]="form" (ngSubmit)="next()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>First name *</mat-label>
          <input matInput formControlName="firstName" autocomplete="given-name">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Last name *</mat-label>
          <input matInput formControlName="lastName" autocomplete="family-name">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Language *</mat-label>
          <mat-select formControlName="locale">
            <mat-option value="en">English</mat-option>
            <mat-option value="fr">French</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Referral code</mat-label>
          <input matInput formControlName="referralCode">
        </mat-form-field>
        <p class="hint">Referrer sees your name, phone, and completed rides</p>

        <mat-checkbox formControlName="hasVehicle" class="vehicle-check">
          I have a vehicle to drive
        </mat-checkbox>

        @if (form.get('hasVehicle')?.value) {
          <h3 class="section-label">Vehicle Details</h3>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Manufacturer *</mat-label>
            <mat-select formControlName="vehicleManufacturer">
              <mat-option value="Toyota">Toyota</mat-option>
              <mat-option value="Honda">Honda</mat-option>
              <mat-option value="Hyundai">Hyundai</mat-option>
              <mat-option value="Ford">Ford</mat-option>
              <mat-option value="Chevrolet">Chevrolet</mat-option>
              <mat-option value="Nissan">Nissan</mat-option>
              <mat-option value="BMW">BMW</mat-option>
              <mat-option value="Mercedes">Mercedes-Benz</mat-option>
              <mat-option value="Kia">Kia</mat-option>
              <mat-option value="Volkswagen">Volkswagen</mat-option>
            </mat-select>
          </mat-form-field>
          <p class="hint">Not in list? info&#64;trvoo.com</p>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Vehicle year *</mat-label>
            <input matInput formControlName="vehicleYear" type="number">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Licence plate *</mat-label>
            <input matInput formControlName="licensePlate" placeholder="ABCD123">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Vehicle colour *</mat-label>
            <mat-select formControlName="vehicleColour">
              <mat-option value="White">White</mat-option>
              <mat-option value="Black">Black</mat-option>
              <mat-option value="Silver">Silver</mat-option>
              <mat-option value="Grey">Grey</mat-option>
              <mat-option value="Blue">Blue</mat-option>
              <mat-option value="Red">Red</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-checkbox formControlName="isWav">
            Vehicle is wheelchair-accessible
          </mat-checkbox>

          @if (form.get('isWav')?.value) {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Accessibility features</mat-label>
              <mat-select formControlName="wavFeatures">
                <mat-option value="Ramp">Ramp</mat-option>
                <mat-option value="Lift">Lift</mat-option>
                <mat-option value="Securement">Securement</mat-option>
              </mat-select>
            </mat-form-field>
          }
        }

        <button mat-flat-button class="pill-btn primary-btn" type="submit"
                [disabled]="form.invalid">
          Next &gt;
        </button>
      </form>
    </div>
  `,
  styles: `
    .setup-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 24px 32px;
    }

    .setup-info {
      font-size: 14px;
      color: var(--trip-on-surface-variant);
      margin: 0 0 16px;
    }

    .full-width { width: 100%; }

    .hint {
      font-size: 12px;
      color: var(--trip-on-surface-hint);
      margin: -4px 0 8px;
    }

    .section-label {
      font-size: 16px;
      font-weight: 600;
      margin: 16px 0 8px;
    }

    .vehicle-check {
      margin: 8px 0 16px;
    }

    .pill-btn {
      border-radius: 24px;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      width: 100%;
      margin-top: 16px;
    }

    .primary-btn {
      background: var(--trip-primary);
      color: white;
    }
  `,
})
export class DriverRegisterPersonal {
  private readonly regService = inject(RegistrationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    locale: ['en', Validators.required],
    referralCode: [''],
    hasVehicle: [true],
    vehicleManufacturer: ['', Validators.required],
    vehicleYear: [null as number | null, Validators.required],
    licensePlate: ['', Validators.required],
    vehicleColour: ['', Validators.required],
    isWav: [false],
    wavFeatures: [''],
  });

  next() {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.regService.updateDriverData({
      firstName: v.firstName!,
      lastName: v.lastName!,
      locale: v.locale!,
      referralCode: v.referralCode || undefined,
      vehicleManufacturer: v.vehicleManufacturer!,
      vehicleYear: v.vehicleYear ?? undefined,
      licensePlate: v.licensePlate!,
      vehicleColour: v.vehicleColour!,
      isWav: v.isWav ?? false,
      wavFeatures: v.wavFeatures || undefined,
    });
    this.router.navigate(['/driver/setup/insurance']);
  }
}

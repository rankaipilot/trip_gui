import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { RegistrationService } from 'service/registration.service';

@Component({
  selector: 'rider-register-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TrvooHeader, ReactiveFormsModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule,
  ],
  template: `
    <trvoo-header title="Profile Setup" />

    <div class="setup-content">
      <p class="setup-info">Set up your profile to get started with TRVOO</p>

      <button mat-stroked-button class="photo-btn" type="button">
        <mat-icon>photo_camera</mat-icon>
        Upload profile photo
      </button>

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
        <p class="referral-hint">Get a discount on your first ride!</p>

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
      gap: 8px;
      padding: 0 24px 32px;
    }

    .setup-info {
      font-size: 15px;
      color: var(--trip-on-surface-variant);
      margin: 0 0 16px;
    }

    .photo-btn {
      border-radius: 50%;
      width: 80px;
      height: 80px;
      align-self: center;
      margin-bottom: 16px;
    }

    .full-width { width: 100%; }

    .referral-hint {
      font-size: 12px;
      color: var(--trip-on-surface-hint);
      margin: -4px 0 16px;
    }

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
  `,
})
export class RiderRegisterProfile {
  private readonly regService = inject(RegistrationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    locale: ['en', Validators.required],
    referralCode: [''],
  });

  next() {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.regService.updateRiderData({
      firstName: v.firstName!,
      lastName: v.lastName!,
      locale: v.locale!,
      referralCode: v.referralCode || undefined,
    });
    this.router.navigate(['/rider/setup/payment']);
  }
}

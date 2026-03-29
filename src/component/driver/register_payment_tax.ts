import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { RegistrationService } from 'service/registration.service';

@Component({
  selector: 'driver-register-payment-tax',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TrvooHeader, ReactiveFormsModule, MatButtonModule, MatCheckboxModule,
    MatFormFieldModule, MatInputModule,
  ],
  template: `
    <trvoo-header title="Payment and Tax" />

    <div class="setup-content">
      <p class="setup-info">Payment and tax details needed for driver payouts</p>

      <form [formGroup]="form" (ngSubmit)="next()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Institution # *</mat-label>
          <input matInput formControlName="institutionNumber" maxlength="3" placeholder="123">
        </mat-form-field>
        <p class="hint">3-digit bank number</p>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Transit # *</mat-label>
          <input matInput formControlName="transitNumber" maxlength="5" placeholder="12345">
        </mat-form-field>
        <p class="hint">5-digit branch number</p>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Account # *</mat-label>
          <input matInput formControlName="accountNumber" maxlength="12" placeholder="12345678">
        </mat-form-field>
        <p class="hint">7 to 12 digits</p>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>SIN *</mat-label>
          <input matInput formControlName="sin" maxlength="9" placeholder="123456789">
        </mat-form-field>
        <p class="hint">Shared with CRA for tax</p>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>GST/HST #</mat-label>
          <input matInput formControlName="gstHstNumber" placeholder="123456789">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Billing address *</mat-label>
          <input matInput formControlName="billingAddress">
        </mat-form-field>
        <p class="hint">Business or home address</p>

        <mat-checkbox formControlName="airwallexAgreement" class="agreement">
          Agree to Airwallex Connected Account Agreement
        </mat-checkbox>

        <div class="nav-buttons">
          <button mat-stroked-button class="pill-btn" type="button" (click)="back()">
            &lt; Back
          </button>
          <button mat-flat-button class="pill-btn primary-btn" type="submit"
                  [disabled]="form.invalid">
            Next &gt;
          </button>
        </div>
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

    .agreement {
      margin: 12px 0 16px;
      font-size: 14px;
    }

    .nav-buttons {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    .pill-btn {
      border-radius: 24px;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      flex: 1;
    }

    .primary-btn {
      background: var(--trip-primary);
      color: white;
    }
  `,
})
export class DriverRegisterPaymentTax {
  private readonly regService = inject(RegistrationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    institutionNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    transitNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    accountNumber: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(12)]],
    sin: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    gstHstNumber: [''],
    billingAddress: ['', Validators.required],
    airwallexAgreement: [false, Validators.requiredTrue],
  });

  next() {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.regService.updateDriverBankInfo({
      institutionNumber: v.institutionNumber!,
      transitNumber: v.transitNumber!,
      accountNumber: v.accountNumber!,
      sin: v.sin!,
      gstHstNumber: v.gstHstNumber || undefined,
      billingAddress: v.billingAddress!,
      airwallexAgreement: v.airwallexAgreement!,
    });
    this.regService.submitDriverRegistration().subscribe({
      next: () => this.router.navigate(['/driver/setup/review']),
      error: () => this.router.navigate(['/driver/setup/review']),
    });
  }

  back() {
    this.router.navigate(['/driver/setup/documents']);
  }
}

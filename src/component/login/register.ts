import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MobileShell } from 'component/shared/mobile_shell';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { AuthService } from 'service/auth.service';
import { RegistrationService } from 'service/registration.service';

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileShell, TrvooHeader, ReactiveFormsModule, MatButtonModule,
    MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  template: `
    <mobile-shell>
      <trvoo-header [title]="role() === 'driver' ? 'Register' : 'Register'" />

      <div class="register-content">
        <h2 class="register-heading">
          {{ role() === 'driver' ? 'Become a driver' : 'Create your account' }}
        </h2>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" autocomplete="email">
          </mat-form-field>

          <div class="phone-row">
            <mat-form-field appearance="outline" class="country-code">
              <mat-label>Code</mat-label>
              <mat-select formControlName="countryCode">
                <mat-option value="+1">+1</mat-option>
                <mat-option value="+44">+44</mat-option>
                <mat-option value="+90">+90</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="phone-field">
              <mat-label>Phone number</mat-label>
              <input matInput formControlName="phone" type="tel" autocomplete="tel">
            </mat-form-field>
          </div>

          @if (role() === 'driver') {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>City</mat-label>
              <mat-select formControlName="city">
                <mat-option value="TORONTO">Toronto</mat-option>
                <mat-option value="MISSISSAUGA">Mississauga</mat-option>
                <mat-option value="BRAMPTON">Brampton</mat-option>
                <mat-option value="HAMILTON">Hamilton</mat-option>
              </mat-select>
            </mat-form-field>
          }

          <mat-checkbox formControlName="consent" class="consent-check">
            @if (role() === 'driver') {
              Consent for legal liability
            } @else {
              I agree to Terms of Service and Privacy Policy
            }
          </mat-checkbox>

          <button mat-flat-button class="pill-btn primary-btn" type="submit"
                  [disabled]="form.invalid || loading()">
            {{ role() === 'driver' ? 'Register as a driver' : 'Register' }}
          </button>

          <p class="otp-note">Sends confirmation code</p>
        </form>

        @if (role() === 'rider') {
          <div class="social-divider"><span>Or register with</span></div>
          <div class="social-buttons">
            <button mat-stroked-button class="pill-btn social-btn">Google</button>
            <button mat-stroked-button class="pill-btn social-btn">Apple</button>
          </div>
        }

        @if (errorMsg()) {
          <p class="error-text">{{ errorMsg() }}</p>
        }
      </div>
    </mobile-shell>
  `,
  styles: `
    .register-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 24px 32px;
    }

    .register-heading {
      font-size: 20px;
      font-weight: 600;
      margin: 8px 0 16px;
    }

    .full-width { width: 100%; }

    .phone-row {
      display: flex;
      gap: 8px;
    }

    .country-code { width: 90px; }
    .phone-field { flex: 1; }

    .consent-check {
      margin: 4px 0 16px;
      font-size: 14px;
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

    .otp-note {
      font-size: 12px;
      color: var(--trip-on-surface-hint);
      text-align: center;
      margin: 4px 0;
    }

    .social-divider {
      text-align: center;
      color: var(--trip-on-surface-variant);
      font-size: 14px;
      margin: 12px 0;
    }

    .social-buttons {
      display: flex;
      gap: 12px;
    }

    .social-btn {
      flex: 1;
      border-radius: 24px;
      height: 44px;
    }

    .error-text {
      color: var(--trip-error);
      font-size: 14px;
      text-align: center;
    }
  `,
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly regService = inject(RegistrationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly role = input('rider');
  readonly loading = signal(false);
  readonly errorMsg = signal('');

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    countryCode: ['+1'],
    phone: ['', Validators.required],
    city: [''],
    consent: [false, Validators.requiredTrue],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMsg.set('');

    const v = this.form.value;
    const contact = (v.countryCode ?? '') + (v.phone ?? '');

    // Save registration data
    if (this.role() === 'driver') {
      this.regService.updateDriverData({ email: v.email!, phone: contact, city: v.city! });
    } else {
      this.regService.updateRiderData({ email: v.email!, phone: contact });
    }

    this.auth.sendOtp({
      contact,
      contactType: 'phone',
      purpose: 'register',
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.router.navigate(['/register', this.role(), 'confirm'], {
          state: { sessionId: res.sessionId, contact, role: this.role() },
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message ?? 'Registration failed. Please try again.');
      },
    });
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrvooHeader } from 'component/shared/trvoo_header';

@Component({
  selector: 'rider-register-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TrvooHeader, ReactiveFormsModule, MatButtonModule,
    MatFormFieldModule, MatInputModule,
  ],
  template: `
    <trvoo-header title="Payment Method" />

    <div class="setup-content">
      <p class="setup-info">Add a payment method to book rides</p>

      <h3 class="section-label">Credit/Debit Card</h3>
      <form [formGroup]="cardForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Card number</mat-label>
          <input matInput formControlName="cardNumber" autocomplete="cc-number">
        </mat-form-field>

        <div class="card-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Expiry MM/YY</mat-label>
            <input matInput formControlName="expiry" placeholder="MM/YY" autocomplete="cc-exp">
          </mat-form-field>
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>CVV</mat-label>
            <input matInput formControlName="cvv" type="password" autocomplete="cc-csc">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name on card</mat-label>
          <input matInput formControlName="cardName" autocomplete="cc-name">
        </mat-form-field>

        <button mat-flat-button class="pill-btn primary-btn" type="button"
                (click)="addCard()" [disabled]="cardForm.invalid">
          Add card
        </button>
      </form>

      <div class="divider"><span>Or pay with</span></div>

      <div class="pay-buttons">
        <button mat-stroked-button class="pill-btn" (click)="next()">Apple Pay</button>
        <button mat-stroked-button class="pill-btn" (click)="next()">Google Pay</button>
      </div>

      <button mat-button class="skip-link" (click)="next()">Skip for now</button>
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
      margin: 0 0 8px;
    }

    .section-label {
      font-size: 16px;
      font-weight: 600;
      margin: 8px 0;
    }

    .full-width { width: 100%; }

    .card-row {
      display: flex;
      gap: 8px;
    }

    .half-width { flex: 1; }

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

    .divider {
      text-align: center;
      color: var(--trip-on-surface-variant);
      font-size: 14px;
      margin: 16px 0;
    }

    .pay-buttons {
      display: flex;
      gap: 12px;
    }

    .pay-buttons .pill-btn { flex: 1; }

    .skip-link {
      align-self: center;
      margin-top: 8px;
      color: var(--trip-on-surface-variant);
    }
  `,
})
export class RiderRegisterPayment {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly cardForm = this.fb.group({
    cardNumber: ['', Validators.required],
    expiry: ['', Validators.required],
    cvv: ['', Validators.required],
    cardName: ['', Validators.required],
  });

  addCard() {
    if (this.cardForm.invalid) return;
    // TODO: integrate with PaymentService when backend is ready
    this.next();
  }

  next() {
    this.router.navigate(['/rider/setup/locations']);
  }
}

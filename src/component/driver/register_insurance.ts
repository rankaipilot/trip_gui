import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { RegistrationService } from 'service/registration.service';

@Component({
  selector: 'driver-register-insurance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TrvooHeader, ReactiveFormsModule, MatButtonModule, MatCheckboxModule],
  template: `
    <trvoo-header title="Insurance Information" />

    <div class="setup-content">
      <p class="setup-info">Review and confirm insurance declarations for ridesharing</p>

      <form [formGroup]="form" (ngSubmit)="next()">
        <mat-checkbox formControlName="maintainPersonalInsurance" class="declaration">
          I will maintain personal auto insurance, insurer licensed in Ontario
        </mat-checkbox>

        <mat-checkbox formControlName="allPerilsCoverage" class="declaration">
          Policy covers All Perils, Collision, Comprehensive
        </mat-checkbox>

        <mat-checkbox formControlName="advisedInsurer" class="declaration">
          I have advised my insurer vehicle used for ridesharing
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
      gap: 8px;
      padding: 0 24px 32px;
    }

    .setup-info {
      font-size: 14px;
      color: var(--trip-on-surface-variant);
      margin: 0 0 16px;
    }

    .declaration {
      display: block;
      margin: 8px 0;
      font-size: 14px;
      line-height: 1.5;
    }

    .nav-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
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
export class DriverRegisterInsurance {
  private readonly regService = inject(RegistrationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    maintainPersonalInsurance: [false, Validators.requiredTrue],
    allPerilsCoverage: [false, Validators.requiredTrue],
    advisedInsurer: [false, Validators.requiredTrue],
  });

  next() {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.regService.updateDriverInsurance({
      maintainPersonalInsurance: v.maintainPersonalInsurance!,
      allPerilsCoverage: v.allPerilsCoverage!,
      advisedInsurer: v.advisedInsurer!,
    });
    this.router.navigate(['/driver/setup/documents']);
  }

  back() {
    this.router.navigate(['/driver/setup/personal']);
  }
}

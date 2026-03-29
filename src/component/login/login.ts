import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MobileShell } from 'component/shared/mobile_shell';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { AuthService } from 'service/auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileShell, TrvooHeader, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, FormsModule,
  ],
  template: `
    <mobile-shell>
      <trvoo-header title="Signin" />

      <div class="login-content">
        <p class="welcome">Welcome to TRVOO</p>

        @if (role() === 'driver') {
          <div class="driver-photo-note">
            <mat-icon>photo_camera</mat-icon>
            <div>
              <p class="note-title">Take your photo on login</p>
              <p class="note-sub">Driver has to provide photo</p>
            </div>
          </div>
        }

        @if (mode() === 'select') {
          <button mat-flat-button class="pill-btn primary-btn" (click)="mode.set('phone')">
            Login with phone number
          </button>
          <button mat-flat-button class="pill-btn secondary-btn" (click)="mode.set('email')">
            Login with email/userid
          </button>

          @if (role() === 'rider') {
            <div class="social-divider">
              <span>Or continue with</span>
            </div>
            <div class="social-buttons">
              <button mat-stroked-button class="pill-btn social-btn">Google</button>
              <button mat-stroked-button class="pill-btn social-btn">Apple</button>
            </div>
          }
        } @else {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ mode() === 'phone' ? 'Phone number' : 'Email or userid' }}</mat-label>
            <input matInput [(ngModel)]="contactValue"
                   [type]="mode() === 'phone' ? 'tel' : 'email'"
                   [autocomplete]="mode() === 'phone' ? 'tel' : 'email'">
            <mat-icon matPrefix>{{ mode() === 'phone' ? 'phone' : 'email' }}</mat-icon>
          </mat-form-field>

          <button mat-flat-button class="pill-btn primary-btn" (click)="sendOtp()"
                  [disabled]="!contactValue || loading()">
            {{ loading() ? 'Sending...' : 'Continue' }}
          </button>

          <button mat-button class="back-link" (click)="mode.set('select')">
            <mat-icon>arrow_back</mat-icon> Back
          </button>

          @if (errorMsg()) {
            <p class="error-text">{{ errorMsg() }}</p>
          }
        }
      </div>
    </mobile-shell>
  `,
  styles: `
    .login-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px 24px 32px;
    }

    .welcome {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px;
      text-align: center;
      color: var(--trip-on-surface);
    }

    .driver-photo-note {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 12px;
      background: var(--trip-warning-light);
      border-radius: 12px;
      margin-bottom: 8px;
    }

    .note-title { margin: 0; font-weight: 600; font-size: 14px; }
    .note-sub { margin: 2px 0 0; font-size: 12px; color: var(--trip-on-surface-variant); }

    .pill-btn {
      border-radius: 24px;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
    }

    .primary-btn {
      background: var(--trip-primary);
      color: white;
    }

    .secondary-btn {
      background: var(--trip-surface-variant);
      color: var(--trip-on-surface);
    }

    .social-divider {
      text-align: center;
      color: var(--trip-on-surface-variant);
      font-size: 14px;
      margin: 8px 0;
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

    .full-width { width: 100%; }

    .back-link {
      align-self: flex-start;
      font-size: 14px;
    }

    .error-text {
      color: var(--trip-error);
      font-size: 14px;
      text-align: center;
      margin: 0;
    }
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly role = input('rider');
  readonly mode = signal<'select' | 'phone' | 'email'>('select');
  readonly loading = signal(false);
  readonly errorMsg = signal('');

  contactValue = '';

  sendOtp() {
    if (!this.contactValue) return;
    this.loading.set(true);
    this.errorMsg.set('');

    this.auth.sendOtp({
      contact: this.contactValue,
      contactType: this.mode() === 'phone' ? 'phone' : 'email',
      purpose: 'login',
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.router.navigate(['/login', this.role(), 'confirm'], {
          state: { sessionId: res.sessionId, contact: this.contactValue, role: this.role() },
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message ?? 'Failed to send code. Please try again.');
      },
    });
  }
}

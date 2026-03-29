import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MobileShell } from 'component/shared/mobile_shell';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { OtpInput } from 'component/shared/otp_input';
import { AuthService } from 'service/auth.service';
import { UserRole } from 'model/appdata';

@Component({
  selector: 'login-confirmation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileShell, TrvooHeader, OtpInput],
  template: `
    <mobile-shell>
      <trvoo-header title="Confirm signin" />

      <div class="confirm-content">
        <p class="confirm-label">Enter code:</p>

        <otp-input
          [contact]="contact()"
          (codeComplete)="verifyOtp($event)"
          (resend)="onResend()" />

        @if (errorMsg()) {
          <p class="error-text">{{ errorMsg() }}</p>
        }
      </div>
    </mobile-shell>
  `,
  styles: `
    .confirm-content {
      padding: 0 24px;
    }

    .confirm-label {
      font-size: 16px;
      font-weight: 600;
      margin: 8px 0;
      text-align: center;
    }

    .error-text {
      color: var(--trip-error);
      font-size: 14px;
      text-align: center;
      margin: 16px 0 0;
    }
  `,
})
export class LoginConfirmation {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly role = input('rider');
  readonly contact = signal('');
  readonly errorMsg = signal('');

  private sessionId = '';

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.sessionId = state['sessionId'] ?? '';
      this.contact.set(state['contact'] ?? '');
    }
  }

  verifyOtp(code: string) {
    this.errorMsg.set('');
    const role = (this.role() as UserRole) || 'rider';

    this.auth.verifyOtp({ sessionId: this.sessionId, code }, role).subscribe({
      next: () => {
        this.auth.navigateToRoleHome(role);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message ?? 'Invalid code. Please try again.');
      },
    });
  }

  onResend() {
    this.auth.sendOtp({
      contact: this.contact(),
      contactType: this.contact().includes('@') ? 'email' : 'phone',
      purpose: 'login',
    }).subscribe({
      next: (res) => { this.sessionId = res.sessionId; },
    });
  }
}

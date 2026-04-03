import { ChangeDetectionStrategy, Component, input, output, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'otp-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="otp-container">
      <p class="otp-sent-to">We sent a code to</p>
      <p class="otp-contact">{{ contact() }}</p>

      <div class="otp-digits" role="group" aria-label="Verification code">
        @for (digit of digits(); track $index) {
          <div class="otp-digit" [class.active]="$index === currentIndex()"
               [attr.aria-label]="'Digit ' + ($index + 1)">
            {{ digit }}
          </div>
        }
      </div>

      <p class="otp-resend">
        @if (canResend()) {
          <button mat-button class="primary" (click)="onResend()" class="resend-btn">Resend code</button>
        } @else {
          Resend code in {{ countdown() }}s
        }
      </p>

      <div class="otp-keypad" role="group" aria-label="Numeric keypad">
        @for (key of keypadKeys; track key) {
          @if (key === '') {
            <div class="keypad-spacer"></div>
          } @else if (key === 'back') {
            <button mat-button class="keypad-key" (click)="onBackspace()" aria-label="Backspace">
              <mat-icon>backspace</mat-icon>
            </button>
          } @else {
            <button mat-button class="keypad-key" (click)="onKeyPress(key)">{{ key }}</button>
          }
        }
      </div>
    </div>
  `,
  styles: `
    .otp-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 24px;
    }

    .otp-sent-to {
      margin: 0;
      color: var(--trip-on-surface-variant);
      font-size: 14px;
    }

    .otp-contact {
      margin: 4px 0 24px;
      font-weight: 600;
      font-size: 16px;
      color: var(--trip-on-surface);
    }

    .otp-digits {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .otp-digit {
      width: 40px;
      height: 48px;
      border: 2px solid var(--trip-border);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
      color: var(--trip-on-surface);
      transition: border-color 0.2s;
    }

    .otp-digit.active {
      border-color: var(--trip-primary);
    }

    .otp-resend {
      margin: 0 0 24px;
      font-size: 14px;
      color: var(--trip-on-surface-variant);
    }

    .resend-btn {
      font-size: 14px;
    }

    .otp-keypad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      width: 100%;
      max-width: 300px;
    }

    .keypad-key {
      height: 56px;
      font-size: 22px;
      font-weight: 500;
      border-radius: 12px;
    }

    .keypad-spacer {
      height: 56px;
    }
  `,
})
export class OtpInput {
  readonly codeLength = input(7);
  readonly contact = input('');

  readonly codeComplete = output<string>();
  readonly resend = output<void>();

  readonly digits = signal<string[]>(Array(7).fill(''));
  readonly countdown = signal(25);
  readonly canResend = signal(false);

  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  readonly currentIndex = computed(() => {
    const d = this.digits();
    const idx = d.findIndex((v) => v === '');
    return idx === -1 ? d.length - 1 : idx;
  });

  readonly keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

  constructor() {
    this.startCountdown();
  }

  onKeyPress(key: string) {
    const d = [...this.digits()];
    const idx = d.findIndex((v) => v === '');
    if (idx === -1) return;
    d[idx] = key;
    this.digits.set(d);

    if (idx === this.codeLength() - 1) {
      this.codeComplete.emit(d.join(''));
    }
  }

  onBackspace() {
    const d = [...this.digits()];
    let idx = d.findIndex((v) => v === '');
    if (idx === -1) idx = d.length;
    if (idx > 0) {
      d[idx - 1] = '';
      this.digits.set(d);
    }
  }

  onResend() {
    this.resend.emit();
    this.canResend.set(false);
    this.countdown.set(25);
    this.startCountdown();
  }

  private startCountdown() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = setInterval(() => {
      const val = this.countdown() - 1;
      this.countdown.set(val);
      if (val <= 0) {
        this.canResend.set(true);
        if (this.countdownTimer) clearInterval(this.countdownTimer);
      }
    }, 1000);
  }
}

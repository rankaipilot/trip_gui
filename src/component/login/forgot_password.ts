import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'service/auth.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, RouterLink],
  template: `
    <div class="login-page">
        <div class="gradient-hero">
            <h1>Reset Password</h1>
        </div>
        <mat-card class="login-card">
            <mat-card-content>
                @if (successMessage()) {
                    <p class="success-text">{{ successMessage() }}</p>
                }
                @if (errorMessage()) {
                    <p class="error-text">{{ errorMessage() }}</p>
                }
                <form [formGroup]="form" (ngSubmit)="submit()">
                    <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Email</mat-label>
                        <input matInput formControlName="email" type="email">
                    </mat-form-field>
                    <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="form.invalid">
                        Send Reset Link
                    </button>
                </form>
            </mat-card-content>
            <mat-card-actions align="end">
                <a mat-button routerLink="/login">Back to Login</a>
            </mat-card-actions>
        </mat-card>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  errorMessage = signal('');
  successMessage = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit() {
    if (this.form.invalid) return;
    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: () => this.successMessage.set('If an account exists, a reset link has been sent.'),
      error: () => this.errorMessage.set('Something went wrong. Please try again.'),
    });
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UserRegistration } from 'model/appdata';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatIconModule, RouterLink,
  ],
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  errorMessage = signal('');
  successMessage = signal('');

  registerForm = this.fb.group({
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Phone: ['', Validators.required],
    Password: ['', [Validators.required, Validators.minLength(8)]],
    ConfirmPassword: ['', Validators.required],
  });

  register(): void {
    this.errorMessage.set('');
    if (this.registerForm.invalid) return;

    const v = this.registerForm.value;
    if (v.Password !== v.ConfirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    const reg: UserRegistration = {
      FirstName: v.FirstName!,
      LastName: v.LastName!,
      Email: v.Email!,
      Phone: v.Phone!,
      Password: v.Password!,
      Locale: 'en',
      Currency: 'USD',
    };

    this.auth.register(reg).subscribe({
      next: () => {
        this.successMessage.set('Registration successful! Please check your email to verify your account.');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Registration failed. Please try again.');
      },
    });
  }
}

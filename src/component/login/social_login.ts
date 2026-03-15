import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { environment } from 'environment/environment';
import { AuthService } from 'service/auth.service';

@Component({
  selector: 'app-social-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCardModule],
  template: `
    <mat-card class="login-card">
        <mat-card-content>
            <p>{{ status() }}</p>
        </mat-card-content>
    </mat-card>
  `,
})
export class SocialLoginComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly auth = inject(AuthService);
  readonly status = signal('Redirecting to Google authentication...');

  ngOnInit() {
    const params = new URLSearchParams(this.document.location.search);
    const code = params.get('code');
    if (code) {
      this.status.set('Logging in...');
      this.auth.loginSocial('google', code);
    } else {
      const clientId = environment.googleClientId;
      const scope = 'openid email profile';
      const redirectUri = this.document.location.origin + '/login/social';
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      this.document.location.href = url;
    }
  }
}

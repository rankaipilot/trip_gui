import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BaseAuthService, configureRestUrls } from '@mustafa-karli/basui';
import {
  ApplicationData, LoginResponse,
  OtpRequest, OtpResponse, OtpVerifyRequest, OtpVerifyResponse,
  RestReport, UserRegistration, UserRole,
} from 'model/appdata';
import { RestURL } from './rest_url';
import { Observable } from 'rxjs';
import { Routes } from '@angular/router';
import { ReportSearch } from 'component/report/report_search';
import { ReportList } from 'component/report/report_list';
import { DashUser } from 'component/dashboard/dash_user';
import { PublicRoutes } from 'app/app.routes';
import { environment } from 'environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseAuthService {
  private readonly tripHttp = inject(HttpClient);
  private readonly loginSocialUrl = environment.httphost + RestURL.loginSocialURL;
  private readonly forgotPasswordUrl = environment.httphost + RestURL.forgotPasswordURL;
  private readonly resetPasswordUrl = environment.httphost + RestURL.resetPasswordURL;
  private readonly otpSendUrl = environment.httphost + RestURL.otpSendURL;
  private readonly otpVerifyUrl = environment.httphost + RestURL.otpVerifyURL;

  constructor() {
    super();
    configureRestUrls(environment.httphost, {
      loginURL: RestURL.loginURL,
      registerURL: RestURL.registerURL,
    });
  }

  readonly currentRole = signal<UserRole | null>(
    (localStorage.getItem('role') as UserRole) || null,
  );

  // ── Trip-specific auth methods ──

  loginSocial(provider: string, idToken: string) {
    this.tripHttp.post<LoginResponse>(this.loginSocialUrl, { provider, id_token: idToken }).subscribe({
        next: (res) => {
            this.token = res.token;
            this.isLoggedIn.set(true);
            localStorage.setItem('jwt', res.token);
            this.loadAppData();
            this.initRoutes();
        },
        error: (err) => {
            console.error('Social login failed:', err);
        },
    });
  }

  override forgotPassword(email: string) {
    return this.tripHttp.post<{ message: string }>(this.forgotPasswordUrl, { email });
  }

  resetPassword(resetToken: string, newPassword: string) {
    return this.tripHttp.post<{ message: string }>(this.resetPasswordUrl, { token: resetToken, new_password: newPassword });
  }

  sendOtp(request: OtpRequest): Observable<OtpResponse> {
    return this.tripHttp.post<OtpResponse>(this.otpSendUrl, request);
  }

  verifyOtp(request: OtpVerifyRequest, role: UserRole): Observable<OtpVerifyResponse> {
    return this.tripHttp.post<OtpVerifyResponse>(this.otpVerifyUrl, request).pipe(
      tap((res) => {
        this.token = res.token;
        this.isLoggedIn.set(true);
        localStorage.setItem('jwt', res.token);
        this.setRole(role);
        this.loadAppData();
      }),
    );
  }

  override loadStoredSession() {
    this.token = localStorage.getItem('jwt');
    if (this.token) {
      this.isLoggedIn.set(true);
      this.loadAppData();
      const role = this.currentRole();
      if (role === 'admin') {
        this.initRoutes();
      }
    }
  }

  override logout() {
    super.logout();
    this.currentRole.set(null);
    localStorage.removeItem('role');
    this.router.navigate(['/public/rider']);
  }

  registerUser(reg: UserRegistration) {
    return this.tripHttp.post<UserRegistration>(environment.httphost + RestURL.registerURL, reg);
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  setRole(role: UserRole) {
    this.currentRole.set(role);
    localStorage.setItem('role', role);
  }

  navigateToRoleHome(role: UserRole) {
    switch (role) {
      case 'rider': this.router.navigate(['/rider/home']); break;
      case 'driver': this.router.navigate(['/driver/home']); break;
      case 'admin': this.initRoutes(); break;
    }
  }

  // ── Override route building to add reports and trip-specific routes ──

  protected override buildExtraRoutes(data: import('@mustafa-karli/basui').ApplicationData): Routes {
    const extraRoutes: Routes = [
      ...PublicRoutes,
      { path: 'dashboard', component: DashUser },
    ];

    const reports = (data as ApplicationData).Reports ?? [];
    for (const report of reports) {
      if (!report.Id) continue;
      extraRoutes.push({
        path: 'report/' + report.Id,
        component: ReportSearch,
        data: { report },
      });
      extraRoutes.push({
        path: 'report/' + report.Id + '/list',
        component: ReportList,
        data: { report },
      });
    }

    return extraRoutes;
  }
}

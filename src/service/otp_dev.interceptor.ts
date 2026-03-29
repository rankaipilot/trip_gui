import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { OtpResponse, OtpVerifyResponse } from 'model/appdata';
import { RestURL } from './rest_url';

/**
 * Development-only interceptor that mocks OTP endpoints.
 * Remove when the backend implements real OTP support.
 */
export const otpDevInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith(RestURL.otpSendURL)) {
    const body: OtpResponse = { sessionId: 'dev-session-' + Date.now(), expiresIn: 120 };
    return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
  }

  if (req.url.endsWith(RestURL.otpVerifyURL)) {
    const body: OtpVerifyResponse = {
      token: 'dev-jwt-token-' + Date.now(),
      isNewUser: false,
    };
    return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
  }

  if (req.url.endsWith(RestURL.otpResendURL)) {
    const body: OtpResponse = { sessionId: 'dev-session-' + Date.now(), expiresIn: 120 };
    return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
  }

  return next(req);
};

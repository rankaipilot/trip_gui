import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from 'app/app';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from 'app/app.routes';
import { authInterceptor } from 'service/auth.interceptor';
import { otpDevInterceptor } from 'service/otp_dev.interceptor';
import { environment } from 'environment/environment';

const interceptors: HttpInterceptorFn[] = [authInterceptor];
if (!environment.production) {
  interceptors.push(otpDevInterceptor);
}

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors(interceptors)),
    provideRouter(routes, withComponentInputBinding()),
    provideCharts(withDefaultRegisterables()),
  ],
});

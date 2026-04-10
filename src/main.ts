import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from 'app/app';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from 'app/app.routes';
import { authInterceptor, apiResponseInterceptor } from '@mustafa-karli/basui';
import { otpDevInterceptor } from 'service/otp_dev.interceptor';
import { environment } from 'environment/environment';
import { BASIS_GUI_CONFIG, BaseAuthService } from '@mustafa-karli/basui';
import { AuthService } from 'service/auth.service';
import { PublicRoutes } from 'app/app.routes';
import { DashUser } from 'component/dashboard/dash_user';

const interceptors: HttpInterceptorFn[] = [apiResponseInterceptor, authInterceptor];
if (!environment.production) {
  interceptors.push(otpDevInterceptor);
}

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors(interceptors)),
    provideRouter(routes, withComponentInputBinding()),
    provideCharts(withDefaultRegisterables()),
    { provide: BaseAuthService, useExisting: AuthService },
    {
      provide: BASIS_GUI_CONFIG,
      useValue: {
        opField: 'op_code',
        hiddenFields: ['op_code', 'PartnerId'],
        publicRoutes: PublicRoutes,
        dashboardComponent: DashUser,
      },
    },
  ],
});

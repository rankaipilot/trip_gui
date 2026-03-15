import { Routes } from '@angular/router';
import { LoginComponent } from 'component/login/login';
import { SocialLoginComponent } from 'component/login/social_login';
import { RegisterComponent } from 'component/login/register';
import { ForgotPasswordComponent } from 'component/login/forgot_password';

export const PublicRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'login/social', component: SocialLoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
];

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    ...PublicRoutes,
];

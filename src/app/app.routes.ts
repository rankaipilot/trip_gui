import { Routes } from '@angular/router';
import { LoginComponent } from 'component/login/login';
import { SocialLoginComponent } from 'component/login/social_login';
import { RegisterComponent } from 'component/login/register';
import { PublicScreen } from 'component/login/public_screen';
import { LoginConfirmation } from 'component/login/login_confirmation';
import { RegisterConfirmation } from 'component/login/register_confirmation';
import { RiderShell } from 'component/rider/rider_shell';
import { RiderHomeComponent } from 'component/rider/rider_home';
import { RideBookingComponent } from 'component/rider/ride_booking';
import { ScheduledRidesComponent } from 'component/rider/scheduled_rides';
import { RideHistoryComponent } from 'component/rider/ride_history';
import { RiderProfileComponent } from 'component/rider/rider_profile';
import { RiderRegisterProfile } from 'component/rider/register_profile';
import { RiderRegisterPayment } from 'component/rider/register_payment';
import { RiderRegisterLocations } from 'component/rider/register_locations';
import { DriverShell } from 'component/driver/driver_shell';
import { DriverDashboardComponent } from 'component/driver/driver_dashboard';
import { DriverRegisterPersonal } from 'component/driver/register_personal';
import { DriverRegisterInsurance } from 'component/driver/register_insurance';
import { DriverRegisterDocuments } from 'component/driver/register_documents';
import { DriverRegisterPaymentTax } from 'component/driver/register_payment_tax';
import { DriverRegisterReview } from 'component/driver/register_review';
import { AdminShell } from 'component/admin/admin_shell';

// Public routes (no authentication required)
export const PublicRoutes: Routes = [
    { path: 'public/:role', component: PublicScreen },
    { path: 'login/:role', component: LoginComponent },
    { path: 'login/:role/confirm', component: LoginConfirmation },
    { path: 'login/social', component: SocialLoginComponent },
    { path: 'register/:role', component: RegisterComponent },
    { path: 'register/:role/confirm', component: RegisterConfirmation },
];

export const routes: Routes = [
    { path: '', redirectTo: 'public/rider', pathMatch: 'full' },
    ...PublicRoutes,

    // Rider routes
    {
        path: 'rider',
        component: RiderShell,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'setup/profile', component: RiderRegisterProfile },
            { path: 'setup/payment', component: RiderRegisterPayment },
            { path: 'setup/locations', component: RiderRegisterLocations },
            { path: 'home', component: RiderHomeComponent },
            { path: 'book', component: RideBookingComponent },
            { path: 'upcoming', component: ScheduledRidesComponent },
            { path: 'activity', component: RideHistoryComponent },
            { path: 'account', component: RiderProfileComponent },
        ],
    },

    // Driver routes
    {
        path: 'driver',
        component: DriverShell,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'setup/personal', component: DriverRegisterPersonal },
            { path: 'setup/insurance', component: DriverRegisterInsurance },
            { path: 'setup/documents', component: DriverRegisterDocuments },
            { path: 'setup/payment', component: DriverRegisterPaymentTax },
            { path: 'setup/review', component: DriverRegisterReview },
            { path: 'home', component: DriverDashboardComponent },
        ],
    },

    // Admin routes (preserves existing sidebar navigation)
    { path: 'admin', component: AdminShell },
];

# trip_gui Migration to basui

Migrate `/Users/mustafakarli/trip/trip_gui` to use `@aspect/gui` from basui.

**Note:** trip_gui has the most project-specific code (rider, driver, admin, shared components, 16+ services). The shared CRUD framework is a small part of this project. Migration is straightforward but has two key differences:
1. trip_gui uses `siud_op` — must switch to `op_code` to match basis backend
2. trip_gui has custom login components (OTP, social) — these stay project-specific

## Pre-requisites

- [ ] basui is published or available at `file:../../sap/basui`

## Step 1: Add basui dependency

- [ ] Add to package.json: `"@aspect/gui": "file:../../sap/basui"`
- [ ] Add to package.json dependencies: `class-validator` (if not already present — required by basui decorators)
- [ ] Add tsconfig.json paths: `"@aspect/gui": ["./node_modules/@aspect/gui/src/index"]`
- [ ] Run `npm install`

## Step 2: Delete shared files (now in basui)

- [ ] `src/component/abstract/base_table.ts`
- [ ] `src/component/abstract/base_form.ts`
- [ ] `src/component/abstract/base_view.ts`
- [ ] `src/component/form/form_field.ts` + `form_field.html`
- [ ] `src/component/form/form_record.ts` + `form_record.html`
- [ ] `src/component/form/form_table.ts` + `form_table.html`
- [ ] `src/component/table/table_list.ts` + `table_list.html` + `table_list.css`
- [ ] `src/component/table/table_search.ts` + `table_search.html`
- [ ] `src/component/table/table_edit.ts` + `table_edit.html` + `table_edit.css`
- [ ] `src/component/table/table_detail.ts` + `table_detail.html` + `table_detail.css`
- [ ] `src/component/table/table_lookup.ts` + `table_lookup.html` + `table_lookup.css`
- [ ] `src/component/navigation/navigation.ts` + `navigation.html` + `navigation.css`
- [ ] `src/service/rest_service.ts`
- [ ] `src/service/auth.interceptor.ts`
- [ ] `src/service/label.service.ts`
- [ ] `src/model/appdata.ts`
- [ ] `src/model/decorator.ts`

**DO NOT delete trip_gui login components** — they are custom (OTP, social login, role-based screens). These stay as project-specific:
- `src/component/login/login.ts`
- `src/component/login/register.ts`
- `src/component/login/register_confirmation.ts`
- `src/component/login/login_confirmation.ts`
- `src/component/login/forgot_password.ts`
- `src/component/login/social_login.ts`
- `src/component/login/public_screen.ts`

## Step 3: Update model/tripdb.ts

- [ ] **CRITICAL:** Replace `siud_op` with `op_code` in SiudAction class and all references
- [ ] Remove shared classes now in basui: SiudAction, ApplicationMenu, ApplicationMenuItem, AuthorizationRolePermission, ConstantValue, UserAccount, UserAccountPolicy
- [ ] Import them from `@aspect/gui` instead
- [ ] Keep all trip-specific: DriverProfile, Vehicle, Ride, RideRequest, Fare, Rating, Promotion, etc.

## Step 4: Global siud_op → op_code rename

This is the biggest change for trip_gui. Search and replace across ALL project-specific files:
- [ ] `grep -rn "siud_op" src/` to find all occurrences
- [ ] Replace `siud_op` → `op_code` in all .ts files
- [ ] Replace `'siud_op'` → `'op_code'` in all template references
- [ ] Verify the trip_gui Go backend also uses `op_code` (it should if it imports basis)

## Step 5: Create AuthService extending BaseAuthService

- [ ] Create `src/service/auth.service.ts` extending `BaseAuthService` from `@aspect/gui`
- [ ] Move trip-specific login methods: `loginSocial()`, `sendOtp()`, `verifyOtp()`, `forgotPassword()`
- [ ] Move trip-specific route generation (admin, driver, rider shells) into `extraRoutes`
- [ ] Decorate with `@Injectable({ providedIn: 'root' })`

## Step 6: Update app.config.ts

- [ ] Add `BASIS_GUI_CONFIG` provider:
  ```typescript
  { provide: BASIS_GUI_CONFIG, useValue: {
    opField: 'op_code',
    hiddenFields: [],  // trip_gui hides nothing
    publicRoutes: PublicRoutes,
    extraRoutes: (data) => [
      // admin routes
      { path: 'admin', component: AdminShell, children: [...] },
      // driver routes
      { path: 'driver', component: DriverShell, children: [...] },
      // rider routes
      { path: 'rider', component: RiderShell, children: [...] },
    ],
  }}
  ```
- [ ] Import `authInterceptor` from `@aspect/gui`

## Step 7: Update app.routes.ts

- [ ] trip_gui has custom public routes (OTP login, social login) — keep these project-specific
- [ ] Only import shared types from `@aspect/gui`, not login components

## Step 8: Update app.ts

- [ ] Import `Navigation` from `@aspect/gui`
- [ ] Use `<app-navigation><span toolbar-title>TRIPMAN</span></app-navigation>`

## Step 9: Move component CSS to global styles

**Note:** All basui components use `ViewEncapsulation.None` — they have no bundled CSS. Each project must provide its own global stylesheet covering basui component selectors (tables, forms, navigation, login, etc.).

- [ ] Component CSS files in trip_gui are already minimal (most styling is in `src/styles/styles.css`)
- [ ] Delete emptied component CSS files after verifying they're in the global stylesheet
- [ ] Verify `src/styles/styles.css` and `src/styles/material-theme.scss` cover all needed styles

## Step 10: Update remaining imports

All project-specific files that import from deleted shared paths:
- [ ] `src/component/admin/*.ts` (8 files)
- [ ] `src/component/driver/*.ts` (12 files)
- [ ] `src/component/rider/*.ts` (12 files)
- [ ] `src/component/shared/*.ts` (10 files)
- [ ] `src/component/dashboard/dash_user.ts`
- [ ] `src/component/report/report_list.ts` + `report_search.ts`
- [ ] `src/component/login/*.ts` (7 files — update base class imports)
- [ ] `src/service/admin.service.ts`
- [ ] `src/service/driver.service.ts`
- [ ] `src/service/ride.service.ts`
- [ ] `src/service/ride_state.store.ts`
- [ ] All other 12+ project-specific services
- [ ] `src/service/rest_url.ts`
- [ ] `src/model/ride_state.ts`

## Step 11: Verify

- [ ] `ng build` succeeds
- [ ] `ng serve` — login works (OTP flow)
- [ ] CRUD operations work (admin tables)
- [ ] Navigation menu loads
- [ ] Admin dashboard works (driver verify, ride monitor, surge control)
- [ ] Driver shell works (dashboard, earnings, ride requests)
- [ ] Rider shell works (booking, tracking, history)
- [ ] Social login still works
- [ ] Report pages still work

## Files that stay in trip_gui (project-specific)

- `src/model/tripdb.ts` (trip domain entities only — with op_code)
- `src/model/ride_state.ts`
- `src/component/admin/` (8 files)
- `src/component/driver/` (12 files)
- `src/component/rider/` (12 files)
- `src/component/shared/` (10 files)
- `src/component/login/` (7 files — custom OTP/social login)
- `src/component/dashboard/dash_user.ts`
- `src/component/report/` (2 files)
- `src/service/auth.service.ts` (extends BaseAuthService)
- `src/service/admin.service.ts`
- `src/service/chat.service.ts`
- `src/service/driver.service.ts`
- `src/service/emergency.service.ts`
- `src/service/geo.service.ts`
- `src/service/notification.service.ts`
- `src/service/otp_dev.interceptor.ts`
- `src/service/payment.service.ts`
- `src/service/pricing.service.ts`
- `src/service/promotion.service.ts`
- `src/service/rating.service.ts`
- `src/service/registration.service.ts`
- `src/service/report_service.ts`
- `src/service/rest_url.ts`
- `src/service/ride.service.ts`
- `src/service/ride_state.store.ts`
- `src/service/split_fare.service.ts`
- `src/service/support.service.ts`
- `src/service/tracking.service.ts`
- `src/environment/` configs
- `src/styles/styles.css` + `src/styles/material-theme.scss` (TRIPMAN branding)
- `src/app/app.ts`, `app.routes.ts`

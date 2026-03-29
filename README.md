# TRVOO Web Application

Angular 21 frontend for the TRVOO ride-hailing platform, serving riders, drivers, and administrators.

## Architecture

- **Frontend**: Angular 21, Angular Material 3, standalone components, signals, OnPush change detection, zoneless
- **Backend**: Go REST API on GCP Cloud Run
- **Hosting**: Firebase Hosting (static SPA)
- **Real-time**: WebSocket for ride tracking and driver location

### Key Design Patterns

- **Mobile-first shell**: All rider/driver screens are constrained to 430px max-width (`MobileShell` component), giving identical appearance on web, iOS, and Android.
- **OTP-based authentication**: Phone/email OTP login replaces passwords. A dev HTTP interceptor mocks OTP endpoints during development.
- **Role-based routing**: Separate route trees for rider (`/rider/**`), driver (`/driver/**`), and admin (`/admin/**`) with dedicated shell components.
- **Bottom tab navigation**: Rider and driver flows use `BottomNav` with 4 tabs each, replacing the desktop sidebar.
- **Multi-step registration wizards**: Rider (3 steps) and driver (5 steps) registration with state persisted in `sessionStorage` via `RegistrationService`.
- **Metadata-driven CRUD**: Backend `/api/config/appdata` serves table definitions, permissions, menus. Generic components render any entity without custom code.
- **3-level OOP inheritance**: `BaseTable` → `BaseView`/`BaseForm` → concrete components. Eliminates CRUD boilerplate.
- **Signal-based state**: `RideStateStore` manages ride lifecycle reactively.
- **Dynamic routing**: `AuthService.initRoutes()` generates admin routes from backend menu configuration.

## Project Structure

```
src/
  app/                  -- Root component, routes, bootstrap
  component/
    abstract/           -- BaseTable, BaseView, BaseForm
    admin/              -- AdminShell, Dashboard, Ride monitor, Disputes, etc.
    form/               -- DynamicField, RecordForm, TableForm
    table/              -- TableList, TableEdit, TableDetail, TableSearch, TableLookup
    navigation/         -- Sidebar + toolbar for admin (legacy desktop layout)
    login/              -- PublicScreen, Login (OTP), LoginConfirmation, Register, RegisterConfirmation
    rider/              -- RiderShell, Home, Booking, Tracking, History, Profile, Registration wizard
    driver/             -- DriverShell, Dashboard, Registration wizard (5 steps), Earnings, Vehicles
    report/             -- ReportSearch, ReportList
    shared/             -- MobileShell, BottomNav, TrvooHeader, OtpInput, DocumentUpload,
                           RideStateChip, StarRating, FareBreakdown, CountdownTimer, RideTypeCard
    dashboard/          -- User dashboard
  model/                -- appdata.ts, tripdb.ts, ride_state.ts, decorator.ts
  service/              -- Auth, REST, Ride, Tracking, Driver, Payment, Registration, etc.
  environment/          -- Dev, Test, Prod configs
  styles/               -- Material theme, global CSS
```

## Screen Flows

### Rider Flow
1. Public Screen (`/public/rider`) → Sign in / Register
2. Login (`/login/rider`) → Phone or Email selection → OTP code
3. Login Confirmation (`/login/rider/confirm`) → OTP verification → Rider Home
4. Registration: Register → OTP → Profile Setup → Payment Method → Favorite Locations → Home
5. Main: Home (map + search) → Booking → Tracking → Ride States → Rating

### Driver Flow
1. Public Screen (`/public/driver`) → Sign in / Register
2. Login (`/login/driver`) → Phone or Email (+ photo requirement)
3. Registration: Register → OTP → Personal Info → Insurance → Documents (6 uploads) → Payment/Tax → Under Review
4. Main: Home (map + online/offline toggle) → Earn More → Rides → Help

### Admin Flow
- Login → Sidebar navigation → Dynamic CRUD pages from backend metadata

## Backend API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/otp/send` | Send OTP code (phone or email) |
| POST | `/auth/otp/verify` | Verify OTP code, returns JWT |
| POST | `/auth/login` | Email/password login (legacy) |
| POST | `/auth/login/social` | Google/Apple social login |
| POST | `/auth/register` | User registration |
| GET | `/api/config/appdata` | Metadata (menus, permissions, tables) |

### Generic CRUD (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{version}/{apiName}/list` | List records with filters |
| GET | `/api/{version}/{apiName}/get` | Get single record |
| POST | `/api/{version}/{apiName}/post` | Create/update record |
| DELETE | `/api/{version}/{apiName}/delete` | Delete record |

### Ride Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rides/estimate` | Fare estimate |
| POST | `/api/rides` | Create ride |
| GET | `/api/rides` | List my rides |
| GET | `/api/rides/{id}` | Ride detail |
| POST | `/api/rides/{id}/cancel` | Cancel ride |

### Driver Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/drivers/status` | Go online/offline |
| POST | `/api/drivers/rides/{id}/accept` | Accept ride |
| POST | `/api/drivers/rides/{id}/complete` | Complete trip |
| GET | `/api/drivers/earnings` | Earnings report |

### WebSocket
| URL | Description |
|-----|-------------|
| `wss://ws.tripman.com/v1/tracking?token=<JWT>` | Real-time ride tracking |

## Environments

| Environment | API Base URL | Firebase Project | Auto Deploy |
|-------------|-------------|-----------------|-------------|
| Development | `http://localhost:8080` | — | — |
| Test | `https://api-test.tripman.com` | `tripman-test` | On push to `main` |
| Production | `https://api.tripman.com` | `tripman-prod` | Manual (GitHub UI) |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (localhost:4200)
npm start

# Build for production
ng build --configuration production

# Build for test
ng build --configuration test

# Run tests
ng test
```

### Dev OTP Interceptor

In development mode (`environment.production = false`), an HTTP interceptor (`otp_dev.interceptor.ts`) mocks OTP endpoints:
- `POST /auth/otp/send` → returns fake `sessionId` + 120s expiry
- `POST /auth/otp/verify` → returns fake JWT token

This allows the full login/register flow to work without a backend OTP implementation. Remove the interceptor when the backend adds real OTP support.

## Test & Validation Steps

### Public Screens
- [ ] Navigate to `http://localhost:4200` → redirects to `/public/rider`
- [ ] See TRVOO-branded landing page at mobile width (430px centered)
- [ ] Click "Sign in" → navigates to `/login/rider`
- [ ] Click "Register" → navigates to `/register/rider`
- [ ] Navigate to `/public/driver` → see driver-specific branding

### Login Flow
- [ ] On `/login/rider` → see phone/email selection buttons and Google/Apple social
- [ ] On `/login/driver` → see phone/email buttons and photo note (no social login)
- [ ] Select "Login with phone" → see phone input field
- [ ] Enter phone and click Continue → navigate to OTP confirmation screen
- [ ] Enter 7-digit code on numeric keypad → auto-verifies → redirects to rider/driver home

### Rider Registration
- [ ] `/register/rider` → email, phone, terms checkbox, Register button
- [ ] OTP confirmation → profile setup (name, language, referral)
- [ ] Payment method step (card form, Apple/Google Pay, skip)
- [ ] Favorite locations step (home/work, skip) → rider home

### Driver Registration
- [ ] `/register/driver` → email, phone, city, consent, Register as driver
- [ ] OTP confirmation → personal info (name, vehicle details, WAV)
- [ ] Insurance declarations (3 checkboxes, all required)
- [ ] Document uploads (6 documents with preview/confirm flow)
- [ ] Payment/tax (bank details, SIN, GST/HST, billing address)
- [ ] Under review screen → "Open the app" → driver home

### Main Screens
- [ ] Rider home: map placeholder, search bar, Home/Work quick actions, 4 bottom tabs
- [ ] Driver home: map placeholder, status banner, online/offline toggle, 4 bottom tabs
- [ ] Bottom tabs navigate between tab screens
- [ ] Mobile shell constrains content to 430px with centered layout on desktop

### Admin Flow
- [ ] Navigate to `/admin` → existing sidebar navigation works

### Build
- [ ] `ng build` succeeds with no errors
- [ ] `ng test` passes

## Deployment to Firebase

### Prerequisites

1. **GCP Projects**: Create two GCP projects (`tripman-test`, `tripman-prod`)
2. **Firebase**: Enable Firebase Hosting in each project
3. **Firebase Sites**: Create hosting sites in each project

```bash
# Variables — replace with actual values
DOMAIN_TEST="app-test.tripman.com"   # Test domain
DOMAIN_PROD="app.tripman.com"        # Production domain
GCP_PROJECT_TEST="tripman-test"
GCP_PROJECT_PROD="tripman-prod"
FIREBASE_SITE_TEST="tripman-test-002"
FIREBASE_SITE_PROD="tripman-prod-002"
GITHUB_ORG="your-org"
GITHUB_REPO="trip_gui"
WIF_POOL="github-pool"
WIF_PROVIDER="github-provider"
SA_NAME="github-deploy"
```

### Step 1: Create Firebase Hosting Sites

```bash
firebase hosting:sites:create $FIREBASE_SITE_TEST --project $GCP_PROJECT_TEST
firebase hosting:sites:create $FIREBASE_SITE_PROD --project $GCP_PROJECT_PROD
```

### Step 2: Set Up Workload Identity Federation (WIF)

```bash
# Create Workload Identity Pool
gcloud iam workload-identity-pools create $WIF_POOL \
  --project=$GCP_PROJECT_TEST \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create OIDC Provider
gcloud iam workload-identity-pools providers create-oidc $WIF_PROVIDER \
  --project=$GCP_PROJECT_TEST \
  --location="global" \
  --workload-identity-pool=$WIF_POOL \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Create Service Account
gcloud iam service-accounts create $SA_NAME \
  --project=$GCP_PROJECT_TEST \
  --display-name="GitHub Deploy SA"

# Grant Firebase Hosting Admin role
gcloud projects add-iam-policy-binding $GCP_PROJECT_TEST \
  --member="serviceAccount:${SA_NAME}@${GCP_PROJECT_TEST}.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin"

# Allow GitHub Actions to impersonate the SA
gcloud iam service-accounts add-iam-policy-binding \
  ${SA_NAME}@${GCP_PROJECT_TEST}.iam.gserviceaccount.com \
  --project=$GCP_PROJECT_TEST \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe $GCP_PROJECT_TEST --format='value(projectNumber)')/locations/global/workloadIdentityPools/${WIF_POOL}/attribute.repository/${GITHUB_ORG}/${GITHUB_REPO}"
```

Repeat for the production project.

### Step 3: Configure GitHub Secrets

| Secret | Value |
|--------|-------|
| `WIF_PROVIDER` | `projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/<POOL>/providers/<PROVIDER>` |
| `WIF_SERVICE_ACCOUNT` | `<SA_NAME>@<PROJECT>.iam.gserviceaccount.com` |

### Step 4: Custom Domain (DNS)

Add CNAME records in your DNS provider:

| Host | Type | Value |
|------|------|-------|
| `app-test` | CNAME | `tripman-test-002.web.app` |
| `app` | CNAME | `tripman-prod-002.web.app` |

Then verify in Firebase Console → Hosting → Custom domain.

### Step 5: Deploy

**Test** (automatic): Push to `main` branch triggers `.github/workflows/deploy-test.yml`.

**Production** (manual): Go to GitHub → Actions → "Deploy to Production" → Run workflow.

**Manual CLI deploy**:
```bash
# Test
ng build --configuration test
firebase use test
firebase deploy --only hosting:app

# Production
ng build --configuration production
firebase use prod
firebase deploy --only hosting:app
```

## Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Angular | 21.x | Framework |
| Angular Material | 21.x | UI components (Material 3) |
| Angular CDK | 21.x | Layout, breakpoints |
| ng2-charts + Chart.js | 10.x / 4.x | Charts and analytics |
| class-validator | 0.15.x | Model validation decorators |
| RxJS | 7.8.x | Reactive programming |
| Vitest | 4.x | Unit testing |

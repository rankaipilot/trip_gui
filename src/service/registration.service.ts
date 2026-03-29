import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  DriverBankInfo, DriverInsuranceDeclarations, DriverRegistration,
  RiderRegistration,
} from 'model/appdata';
import { RestURL } from './rest_url';

const STORAGE_KEY = 'registration_state';

interface RegistrationState {
  riderData: Partial<RiderRegistration>;
  driverData: Partial<DriverRegistration>;
  driverInsurance: Partial<DriverInsuranceDeclarations>;
  driverBankInfo: Partial<DriverBankInfo>;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly http = inject(HttpClient);
  private readonly registerUrl = environment.httphost + RestURL.registerURL;

  readonly riderData = signal<Partial<RiderRegistration>>(
    this.loadState().riderData,
  );
  readonly driverData = signal<Partial<DriverRegistration>>(
    this.loadState().driverData,
  );
  readonly driverInsurance = signal<Partial<DriverInsuranceDeclarations>>(
    this.loadState().driverInsurance,
  );
  readonly driverBankInfo = signal<Partial<DriverBankInfo>>(
    this.loadState().driverBankInfo,
  );
  readonly driverDocuments = signal<Map<string, File>>(new Map());

  updateRiderData(patch: Partial<RiderRegistration>) {
    this.riderData.update((prev) => ({ ...prev, ...patch }));
    this.persist();
  }

  updateDriverData(patch: Partial<DriverRegistration>) {
    this.driverData.update((prev) => ({ ...prev, ...patch }));
    this.persist();
  }

  updateDriverInsurance(patch: Partial<DriverInsuranceDeclarations>) {
    this.driverInsurance.update((prev) => ({ ...prev, ...patch }));
    this.persist();
  }

  updateDriverBankInfo(patch: Partial<DriverBankInfo>) {
    this.driverBankInfo.update((prev) => ({ ...prev, ...patch }));
    this.persist();
  }

  addDriverDocument(type: string, file: File) {
    this.driverDocuments.update((docs) => {
      const next = new Map(docs);
      next.set(type, file);
      return next;
    });
  }

  submitRiderRegistration(): Observable<unknown> {
    const data = this.riderData();
    return this.http.post(this.registerUrl, {
      Email: data.email,
      Phone: data.phone,
      FirstName: data.firstName ?? '',
      LastName: data.lastName ?? '',
      Locale: data.locale ?? 'en',
      Password: 'otp-placeholder',
      Currency: 'CAD',
    }).pipe(tap(() => this.reset()));
  }

  submitDriverRegistration(): Observable<unknown> {
    const data = this.driverData();
    return this.http.post(this.registerUrl, {
      Email: data.email,
      Phone: data.phone,
      FirstName: data.firstName ?? '',
      LastName: data.lastName ?? '',
      Locale: data.locale ?? 'en',
      Password: 'otp-placeholder',
      Currency: 'CAD',
    }).pipe(tap(() => this.reset()));
  }

  reset() {
    this.riderData.set({});
    this.driverData.set({});
    this.driverInsurance.set({});
    this.driverBankInfo.set({});
    this.driverDocuments.set(new Map());
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private persist() {
    const state: RegistrationState = {
      riderData: this.riderData(),
      driverData: this.driverData(),
      driverInsurance: this.driverInsurance(),
      driverBankInfo: this.driverBankInfo(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private loadState(): RegistrationState {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch { /* fall through */ }
    }
    return { riderData: {}, driverData: {}, driverInsurance: {}, driverBankInfo: {} };
  }
}

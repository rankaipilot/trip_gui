// Re-export shared types from basui
import type { ApplicationData as BaseApplicationData, RestReport } from '@mustafa-karli/basui';
export { DataType } from '@mustafa-karli/basui';
export type { LoginRequest, LoginResponse, AuthSummary,
         TableColumn, TableAction, ForeignKey, TableDefinition, DictionaryPath,
         PartnerRegistration, ReportParam, RestReport,
         LoginResponse2FA, TwoFactorSetupResponse, TwoFactorVerifyRequest,
         TwoFactorVerifyResponse, TrustedDevice } from '@mustafa-karli/basui';

// Extended ApplicationData with trip-specific Reports field
export interface ApplicationData extends BaseApplicationData {
    Reports: RestReport[];
}

// ── Trip-specific types ──

export interface UserRegistration {
  FirstName:    string;
  LastName:     string;
  Email:        string;
  Phone:        string;
  Password:     string;
  Locale:       string;
  Currency:     string;
}

// ── OTP Authentication ──

export type UserRole = 'rider' | 'driver' | 'admin';

export interface OtpRequest {
  contact: string;
  contactType: 'phone' | 'email';
  purpose: 'login' | 'register';
}

export interface OtpResponse {
  sessionId: string;
  expiresIn: number;
}

export interface OtpVerifyRequest {
  sessionId: string;
  code: string;
}

export interface OtpVerifyResponse {
  token: string;
  isNewUser: boolean;
}

// ── Rider Registration ──

export interface RiderRegistration {
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  locale?: string;
  photoUrl?: string;
  referralCode?: string;
}

// ── Driver Registration ──

export interface DriverRegistration {
  email: string;
  phone: string;
  city: string;
  firstName?: string;
  lastName?: string;
  locale?: string;
  referralCode?: string;
  vehicleManufacturer?: string;
  vehicleYear?: number;
  licensePlate?: string;
  vehicleColour?: string;
  isWav?: boolean;
  wavFeatures?: string;
}

export interface DriverInsuranceDeclarations {
  maintainPersonalInsurance: boolean;
  allPerilsCoverage: boolean;
  advisedInsurer: boolean;
}

export interface DriverBankInfo {
  institutionNumber: string;
  transitNumber: string;
  accountNumber: string;
  sin: string;
  gstHstNumber?: string;
  billingAddress: string;
  airwallexAgreement: boolean;
}

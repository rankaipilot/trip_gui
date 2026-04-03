import { AbstractControlOptions } from '@angular/forms';
import { ApplicationMenu, AuthorizationRolePermission, ConstantValue } from './tripdb';

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthSummary {
    Obj: string;
    Act: string;
    Val: string;
    Reg: string;
}

export interface ReportParam {
    Name: string;
    DataType: string;
}

export interface RestReport {
    Id: string;
    Version: string;
    QueryName: string;
    Params: ReportParam[];
}

export interface ApplicationData {
    MainMenu: ApplicationMenu[];
    Permissions: AuthorizationRolePermission[];
    ConstantCache: {[key: string]: {[key: string]: string}};
    TableCache: {[key: string]: {[key: string]: string}};
    TableDefinitions: {[key: string]: TableDefinition};
    Apis: {[key: string]: DictionaryPath};
    Reports: RestReport[];
    [key: string]: unknown;
}

export interface TableColumn {
  ColumnName:   string;
  PascalName:   string;
  Caption:      string;
  DataType:     string;
  InputType:    'text' | 'password' | 'number' | 'date' | 'datetime' | 'datetime-local' | 'textarea' | 'select' | 'checkbox';
  Size:         number;
  Scale:        number;
  Step:         string;
  Order:        number;
  Required:     boolean;
  IsKey:        boolean;
  SequenceName: string;
  LookupDomain: string;
  LookupTable:  string;
  LookupStyle:  string;
  HasDefault:   boolean;
  DefaultValue: string;
  Validators?:  AbstractControlOptions['validators'];
}

export interface TableAction {
  action:         string;
  caption:        string;
  method:         string;
  enable:         string;
  authorityCheck: string;
  recordSpecific: string;
}

export interface ForeignKey {
  ParentTable:    string;
  ChildTable:     string;
  PascalName:     string;
  ConstraintName: string;
  LookupStyle:    string;
  Columns:        TableColumn[];
}

export interface TableDefinition {
  TableName:             string;
  PascalName:            string;
  PartnerSpecific:       boolean;
  Keys:                  TableColumn[];
  Columns:               TableColumn[];
  Actions:               TableAction[];
  LookupStyle:           string;
  LookupColumns:         TableColumn[];
  Details:               string[];
  Parents:               ForeignKey[];
  Children:              ForeignKey[];
}

export interface DictionaryPath {
  RestAPI:     string;
  Version:     string;
  Table:       TableDefinition;
  Caption:     string;
  PascalName:  string;
  PathType:    string;
  ParentKeys:   TableColumn[];
  ChildKeys:    TableColumn[];
  Children:     DictionaryPath[];
}

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

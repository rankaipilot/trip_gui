// Re-export shared classes from basui
import { SiudAction } from '@aspect/gui';
export { SiudAction, ApplicationMenu, ApplicationMenuItem, AuthorizationRolePermission,
         ConstantValue, UserAccount, UserAccountPolicy } from '@aspect/gui';

// ── Trip-specific domain classes ──

export class DriverProfile extends SiudAction {
  DriverId?: string;
  UserId?: string;
  LicenseNumber?: string;
  LicenseExpiry?: string;
  VerificationStatus?: string;
  BackgroundCheckStatus?: string;
  RatingAvg?: number;
  TotalTrips?: number;
  IsOnline?: string;
}

export class Vehicle extends SiudAction {
  VehicleId?: string;
  DriverId?: string;
  Make?: string;
  Model?: string;
  Year?: number;
  Color?: string;
  LicensePlate?: string;
  RideType?: string;
  Capacity?: number;
  IsActive?: string;
}

export class Ride extends SiudAction {
  RideId?: string;
  RiderId?: string;
  DriverId?: string;
  Status?: string;
  RideType?: string;
  PickupLat?: number;
  PickupLng?: number;
  PickupAddress?: string;
  DropoffLat?: number;
  DropoffLng?: number;
  DropoffAddress?: string;
  EstimatedFare?: number;
  ActualFare?: number;
  SurgeMultiplier?: number;
  RequestedAt?: string;
  CompletedAt?: string;
}

export class RideFareItem extends SiudAction {
  RideId?: string;
  ItemType?: string;
  Label?: string;
  Amount?: number;
}

export class PaymentMethod extends SiudAction {
  PaymentMethodId?: string;
  UserId?: string;
  Type?: string;
  Brand?: string;
  LastFour?: string;
  ExpiryMonth?: number;
  ExpiryYear?: number;
  IsDefault?: string;
}

export class SupportTicket extends SiudAction {
  TicketId?: string;
  UserId?: string;
  RideId?: string;
  Category?: string;
  Priority?: string;
  Status?: string;
  Subject?: string;
  CreatedAt?: string;
}

export class Promotion extends SiudAction {
  PromotionId?: string;
  Code?: string;
  DiscountType?: string;
  DiscountValue?: number;
  MaxUses?: number;
  UsesRemaining?: number;
  ExpiresAt?: string;
  IsActive?: string;
}

export class PlatformConfig extends SiudAction {
  ConfigKey?: string;
  ConfigValue?: string;
  Description?: string;
}

export class PricingRate extends SiudAction {
  RegionId?: string;
  RideType?: string;
  BaseFare?: number;
  PerKm?: number;
  PerMinute?: number;
  BookingFee?: number;
  MinimumFare?: number;
}

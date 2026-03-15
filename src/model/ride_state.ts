export type RideStatus = 'IDLE' | 'Q' | 'M' | 'E' | 'A' | 'I' | 'C' | 'X' | 'N';

export const RIDE_STATUS_LABELS: Record<RideStatus, string> = {
  IDLE: 'Idle',
  Q: 'Requested',
  M: 'Matched',
  E: 'En Route',
  A: 'Arrived',
  I: 'In Progress',
  C: 'Completed',
  X: 'Cancelled',
  N: 'No Drivers',
};

export const RIDE_STATUS_COLORS: Record<RideStatus, { text: string; bg: string }> = {
  IDLE: { text: '#757575', bg: '#F5F5F5' },
  Q: { text: '#F57C00', bg: '#FFF3E0' },
  M: { text: '#1976D2', bg: '#E3F2FD' },
  E: { text: '#7B1FA2', bg: '#F3E5F5' },
  A: { text: '#00796B', bg: '#E0F2F1' },
  I: { text: '#1976D2', bg: '#E3F2FD' },
  C: { text: '#388E3C', bg: '#C8E6C9' },
  X: { text: '#D32F2F', bg: '#FFCDD2' },
  N: { text: '#757575', bg: '#F5F5F5' },
};

export interface LatLng {
  lat: number;
  lng: number;
}

export interface FareEstimate {
  rideType: string;
  estimatedFare: number;
  surgeMultiplier: number;
  etaMinutes: number;
  distanceKm: number;
  fareItems: { label: string; amount: number }[];
}

export interface MapMarker {
  position: LatLng;
  type: 'pickup' | 'dropoff' | 'driver' | 'stop' | 'surge';
  label?: string;
  heading?: number;
}

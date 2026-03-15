import { Injectable, signal } from '@angular/core';
import { environment } from 'environment/environment';
import { LatLng, RideStatus } from 'model/ride_state';

export interface TrackingEvent {
  type: string;
  ride_id?: string;
  lat?: number;
  lng?: number;
  heading?: number;
  eta_seconds?: number;
  distance_remaining_m?: number;
  old_status?: RideStatus;
  new_status?: RideStatus;
  message?: any;
}

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private ws: WebSocket | null = null;
  private retryCount = 0;
  private readonly MAX_RETRIES = 10;

  readonly connected = signal(false);

  connect() {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    this.ws = new WebSocket(`${environment.wshost}/tracking?token=${token}`);

    this.ws.onopen = () => {
      this.connected.set(true);
      this.retryCount = 0;
    };

    this.ws.onclose = () => {
      this.connected.set(false);
      this.reconnect();
    };

    this.ws.onerror = () => {
      this.connected.set(false);
    };
  }

  private reconnect() {
    if (this.retryCount >= this.MAX_RETRIES) return;
    this.retryCount++;
    const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
    setTimeout(() => this.connect(), delay);
  }

  subscribe(rideId: string) {
    this.send({ type: 'subscribe', ride_id: rideId });
  }

  unsubscribe(rideId: string) {
    this.send({ type: 'unsubscribe', ride_id: rideId });
  }

  sendLocationUpdate(lat: number, lng: number, heading: number, speedMps: number) {
    this.send({ type: 'location_update', lat, lng, heading, speed_mps: speedMps, timestamp: new Date().toISOString() });
  }

  onMessage(handler: (event: TrackingEvent) => void) {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          handler(JSON.parse(event.data));
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };
    }
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}

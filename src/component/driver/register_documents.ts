import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TrvooHeader } from 'component/shared/trvoo_header';
import { DocumentUpload } from 'component/shared/document_upload';
import { RegistrationService } from 'service/registration.service';

interface DocConfig {
  type: string;
  label: string;
  description: string;
}

const DOCUMENTS: DocConfig[] = [
  { type: 'PTC_CERT', label: 'PTC Training Certificate', description: 'Toronto/Mississauga drivers must complete training' },
  { type: 'LICENCE', label: "Driver's Licence front", description: 'Not expired | 25+ | G licence' },
  { type: 'WORK_ELIGIBILITY', label: 'Work Eligibility', description: 'Passport, birth cert, citizenship, or work permit' },
  { type: 'VEHICLE_REG', label: 'Vehicle Registration', description: 'Make, model, year, plate, VIN, expiration visible' },
  { type: 'VEHICLE_INSPECTION', label: 'Vehicle Inspection', description: 'Safety Standards Certificate' },
  { type: 'VEHICLE_INSURANCE', label: 'Vehicle Insurance', description: 'Name, VIN, insurer, expiration visible' },
];

@Component({
  selector: 'driver-register-documents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TrvooHeader, MatButtonModule, DocumentUpload],
  template: `
    <trvoo-header title="Documents" />

    <div class="setup-content">
      <p class="setup-info">Take photos of original documents. No photocopies.</p>

      @for (doc of documents; track doc.type) {
        <document-upload
          [label]="doc.label"
          [description]="doc.description"
          (fileConfirmed)="onDocConfirmed(doc.type, $event)" />
      }

      <div class="nav-buttons">
        <button mat-stroked-button class="pill-btn" (click)="back()">
          &lt; Back
        </button>
        <button mat-flat-button class="pill-btn primary-btn" (click)="next()"
                [disabled]="!allConfirmed()">
          Next &gt;
        </button>
      </div>
    </div>
  `,
  styles: `
    .setup-content {
      display: flex;
      flex-direction: column;
      padding: 0 24px 32px;
    }

    .setup-info {
      font-size: 14px;
      color: var(--trip-on-surface-variant);
      margin: 0 0 8px;
    }

    .nav-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .pill-btn {
      border-radius: 24px;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      flex: 1;
    }

    .primary-btn {
      background: var(--trip-primary);
      color: white;
    }
  `,
})
export class DriverRegisterDocuments {
  private readonly regService = inject(RegistrationService);
  private readonly router = inject(Router);

  readonly documents = DOCUMENTS;

  readonly allConfirmed = computed(() =>
    DOCUMENTS.every((doc) => this.regService.driverDocuments().has(doc.type)),
  );

  onDocConfirmed(type: string, file: File) {
    this.regService.addDriverDocument(type, file);
  }

  next() {
    this.router.navigate(['/driver/setup/payment']);
  }

  back() {
    this.router.navigate(['/driver/setup/insurance']);
  }
}

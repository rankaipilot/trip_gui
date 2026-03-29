import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'document-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule],
  template: `
    <div class="doc-upload">
      <h3 class="doc-label">{{ label() }} @if (required()) { <span class="required">*</span> }</h3>
      <p class="doc-description">{{ description() }}</p>

      @if (!previewUrl()) {
        <button mat-stroked-button class="upload-btn" (click)="fileInput.click()">
          <mat-icon>upload_file</mat-icon>
          Upload File
        </button>
        <input #fileInput type="file" hidden [accept]="accept()" (change)="onFileSelected($event)"
               [attr.aria-label]="'Upload ' + label()">
      } @else {
        <div class="doc-preview">
          <img [src]="previewUrl()" [alt]="label() + ' preview'" class="preview-img">
        </div>

        <div class="doc-checks">
          <mat-checkbox (change)="visibleCheck.set($event.checked)">Visible</mat-checkbox>
          <mat-checkbox (change)="readableCheck.set($event.checked)">Readable</mat-checkbox>
          <mat-checkbox (change)="realCheck.set($event.checked)">Real</mat-checkbox>
        </div>

        <div class="doc-actions">
          <button mat-flat-button color="primary" (click)="onConfirm()"
                  [disabled]="!allChecked()">Confirm</button>
          <button mat-stroked-button (click)="onUploadAgain()">Upload again</button>
        </div>
      }

      @if (confirmed()) {
        <p class="doc-confirmed"><mat-icon>check_circle</mat-icon> Confirmed</p>
      }
    </div>
  `,
  styles: `
    .doc-upload {
      padding: 16px 0;
      border-bottom: 1px solid var(--trip-border-light);
    }

    .doc-label {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .required { color: var(--trip-error); }

    .doc-description {
      margin: 4px 0 12px;
      font-size: 13px;
      color: var(--trip-on-surface-variant);
    }

    .upload-btn {
      width: 100%;
    }

    .doc-preview {
      margin: 8px 0;
      border: 1px solid var(--trip-border);
      border-radius: 8px;
      overflow: hidden;
    }

    .preview-img {
      width: 100%;
      max-height: 200px;
      object-fit: contain;
      display: block;
    }

    .doc-checks {
      display: flex;
      gap: 16px;
      margin: 8px 0;
    }

    .doc-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .doc-confirmed {
      margin: 8px 0 0;
      color: var(--trip-success);
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }
  `,
})
export class DocumentUpload {
  readonly label = input.required<string>();
  readonly description = input('');
  readonly required = input(true);
  readonly accept = input('image/*,.pdf');

  readonly fileConfirmed = output<File>();

  readonly previewUrl = signal<string | null>(null);
  readonly confirmed = signal(false);
  readonly visibleCheck = signal(false);
  readonly readableCheck = signal(false);
  readonly realCheck = signal(false);

  private selectedFile: File | null = null;

  allChecked() {
    return this.visibleCheck() && this.readableCheck() && this.realCheck();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile = file;
    this.confirmed.set(false);
    this.visibleCheck.set(false);
    this.readableCheck.set(false);
    this.realCheck.set(false);

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  onConfirm() {
    if (this.selectedFile && this.allChecked()) {
      this.confirmed.set(true);
      this.fileConfirmed.emit(this.selectedFile);
    }
  }

  onUploadAgain() {
    this.previewUrl.set(null);
    this.confirmed.set(false);
    this.selectedFile = null;
  }
}

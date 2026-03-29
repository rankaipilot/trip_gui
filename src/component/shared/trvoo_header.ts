import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'trvoo-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSelectModule],
  template: `
    <header class="trvoo-header">
      <div class="trvoo-header-row">
        <div class="trvoo-logo" aria-label="TRVOO">
          <span class="trvoo-logo-text">TRVOO</span>
        </div>
        @if (showLanguage()) {
          <mat-select class="trvoo-lang" value="en" aria-label="Language">
            <mat-option value="en">ENG</mat-option>
            <mat-option value="fr">FRA</mat-option>
          </mat-select>
        }
      </div>
      @if (title()) {
        <p class="trvoo-header-title">{{ title() }}</p>
      }
    </header>
  `,
  styles: `
    .trvoo-header {
      padding: 16px 24px 8px;
    }

    .trvoo-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .trvoo-logo-text {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 2px;
      color: var(--trip-primary);
    }

    .trvoo-lang {
      width: 72px;
      font-size: 13px;
    }

    .trvoo-header-title {
      margin: 12px 0 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--trip-on-surface);
    }
  `,
})
export class TrvooHeader {
  readonly title = input('');
  readonly showLanguage = input(true);
}

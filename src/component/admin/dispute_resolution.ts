import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'dispute-resolution',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Dispute Resolution</h2>
            <p class="status-text">No open disputes.</p>
        </div>
    `,
})
export class DisputeResolutionComponent {}

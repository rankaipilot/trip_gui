import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'notif-templates',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule],
    template: `
        <div class="page-container">
            <h2>Notification Templates</h2>
            <p class="status-text">Template editor will be rendered here.</p>
        </div>
    `,
})
export class NotifTemplatesComponent {}

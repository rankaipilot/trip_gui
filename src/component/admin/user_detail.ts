import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'admin-user-detail',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule],
    template: `
        <div class="page-container">
            <h2>User Detail</h2>
            <mat-card>
                <mat-card-content>
                    <p class="status-text">Select a user to view details.</p>
                </mat-card-content>
            </mat-card>
        </div>
    `,
})
export class UserDetailComponent {}

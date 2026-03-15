import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'split-fare',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule],
    template: `
        <div class="page-container">
            <h2>Split Fare</h2>
            <p>Invite friends to split the cost of your ride.</p>
            <button mat-raised-button color="primary">Invite Participant</button>
        </div>
    `,
})
export class SplitFareComponent {}

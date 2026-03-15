import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RideStatus, RIDE_STATUS_LABELS, RIDE_STATUS_COLORS } from 'model/ride_state';

@Component({
    selector: 'ride-state-chip',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <span class="ride-state-chip"
              [style.color]="colors().text"
              [style.background-color]="colors().bg"
              role="status">
            {{ label() }}
        </span>
    `,
})
export class RideStateChip {
    readonly state = input<RideStatus>('IDLE');

    label() {
        return RIDE_STATUS_LABELS[this.state()] ?? this.state();
    }

    colors() {
        return RIDE_STATUS_COLORS[this.state()] ?? { text: '#757575', bg: '#F5F5F5' };
    }
}

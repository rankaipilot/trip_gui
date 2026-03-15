import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

const RIDE_TYPE_ICONS: Record<string, string> = {
    E: 'directions_car',
    P: 'local_taxi',
    X: 'airport_shuttle',
    O: 'people',
    A: 'celebration',
    R: 'explore',
    W: 'accessible',
};

const RIDE_TYPE_NAMES: Record<string, string> = {
    E: 'Economy',
    P: 'Premium',
    X: 'XL',
    O: 'Pool',
    A: 'Party Mode',
    R: 'Experience',
    W: 'Accessible',
};

@Component({
    selector: 'ride-type-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatIconModule, CurrencyPipe],
    template: `
        <mat-card [class.selected]="selected()" (click)="select.emit(rideType())" role="radio"
                  [attr.aria-checked]="selected()" [attr.aria-label]="typeName()">
            <mat-card-content>
                <mat-icon>{{ typeIcon() }}</mat-icon>
                <div class="type-name">{{ typeName() }}</div>
                @if (estimate()) {
                    <div class="type-price">{{ estimate() | currency }}</div>
                }
                @if (eta()) {
                    <div class="type-eta">{{ eta() }} min</div>
                }
            </mat-card-content>
        </mat-card>
    `,
    styles: [`
        mat-card { cursor: pointer; text-align: center; min-width: 100px; transition: box-shadow 0.2s; }
        mat-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .selected { border: 2px solid var(--trip-primary); }
        .type-name { font-weight: 600; margin-top: 4px; }
        .type-price { color: var(--trip-secondary); font-weight: 700; }
        .type-eta { font-size: 12px; color: var(--trip-on-surface-variant); }
    `],
})
export class RideTypeCard {
    readonly rideType = input('E');
    readonly estimate = input<number | null>(null);
    readonly eta = input<number | null>(null);
    readonly selected = input(false);
    readonly select = output<string>();

    typeIcon() { return RIDE_TYPE_ICONS[this.rideType()] ?? 'directions_car'; }
    typeName() { return RIDE_TYPE_NAMES[this.rideType()] ?? this.rideType(); }
}

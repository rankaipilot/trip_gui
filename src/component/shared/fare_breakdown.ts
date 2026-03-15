import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'fare-breakdown',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CurrencyPipe],
    template: `
        <div class="fare-breakdown">
            @for (item of fareItems(); track item.label) {
                <div class="fare-row">
                    <span class="fare-label">{{ item.label }}</span>
                    <span class="fare-amount">{{ item.amount | currency }}</span>
                </div>
            }
            <div class="fare-row fare-total">
                <span class="fare-label">Total</span>
                <span class="fare-amount">{{ total() | currency }}</span>
            </div>
        </div>
    `,
    styles: [`
        .fare-breakdown { padding: 8px 0; }
        .fare-row { display: flex; justify-content: space-between; padding: 4px 0; }
        .fare-total { font-weight: 600; border-top: 1px solid var(--trip-border); margin-top: 8px; padding-top: 8px; }
    `],
})
export class FareBreakdown {
    readonly fareItems = input<{ label: string; amount: number }[]>([]);
    readonly total = input(0);
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'star-rating',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule],
    template: `
        @for (star of stars; track star) {
            <mat-icon
                [class.filled]="star <= value()"
                [class.interactive]="!readOnly()"
                (click)="!readOnly() && rate(star)"
                [attr.aria-label]="star + ' star' + (star > 1 ? 's' : '')">
                {{ star <= value() ? 'star' : 'star_border' }}
            </mat-icon>
        }
    `,
    host: {
        'class': 'star-rating',
        '[style.font-size]': 'size()',
    },
    styles: [`
        :host { display: inline-flex; gap: 2px; }
        .filled { color: #FFA000; }
        .interactive { cursor: pointer; }
        .interactive:hover { color: #FFB74D; }
    `],
})
export class StarRating {
    readonly value = input(0);
    readonly readOnly = input(false);
    readonly size = input('24px');
    readonly valueChange = output<number>();

    stars = [1, 2, 3, 4, 5];

    rate(star: number) {
        this.valueChange.emit(star);
    }
}

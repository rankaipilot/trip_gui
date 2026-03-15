import { ChangeDetectionStrategy, Component, input, output, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
    selector: 'countdown-timer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <span class="countdown" [class.urgent]="remaining() <= 10" role="timer" [attr.aria-label]="'Time remaining: ' + remaining() + ' seconds'">
            {{ display() }}
        </span>
    `,
    styles: [`
        .countdown { font-size: 20px; font-weight: 700; font-variant-numeric: tabular-nums; }
        .urgent { color: var(--trip-error); }
    `],
})
export class CountdownTimer implements OnInit, OnDestroy {
    readonly seconds = input(0);
    readonly onExpire = output<void>();

    readonly remaining = signal(0);
    readonly display = signal('0:00');
    private intervalId: ReturnType<typeof setInterval> | null = null;

    ngOnInit() {
        this.remaining.set(this.seconds());
        this.updateDisplay();
        this.intervalId = setInterval(() => {
            const r = this.remaining() - 1;
            this.remaining.set(r);
            this.updateDisplay();
            if (r <= 0) {
                this.clearInterval();
                this.onExpire.emit();
            }
        }, 1000);
    }

    ngOnDestroy() {
        this.clearInterval();
    }

    private clearInterval() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private updateDisplay() {
        const r = Math.max(0, this.remaining());
        const min = Math.floor(r / 60);
        const sec = r % 60;
        this.display.set(`${min}:${sec.toString().padStart(2, '0')}`);
    }
}

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PaymentService } from 'service/payment.service';
import { PaymentMethod } from 'model/tripdb';

@Component({
    selector: 'payment-methods',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Payment Methods</h2>
            <button mat-raised-button class="accent" style="margin-bottom:16px;">
                <mat-icon>add</mat-icon> Add Payment Method
            </button>
            @for (method of methods(); track method.PaymentMethodId) {
                <mat-card style="margin-bottom:8px;">
                    <mat-card-content style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <mat-icon>credit_card</mat-icon>
                            <span>{{ method.Brand }} **** {{ method.LastFour }}</span>
                            @if (method.IsDefault === 'T') {
                                <span style="color:var(--trip-success);margin-left:8px;">(Default)</span>
                            }
                        </div>
                        <button mat-icon-button aria-label="Delete payment method"><mat-icon>delete</mat-icon></button>
                    </mat-card-content>
                </mat-card>
            }
            @if (methods().length === 0) {
                <p class="status-text">No payment methods added yet.</p>
            }
        </div>
    `,
})
export class PaymentMethodsComponent implements OnInit {
    private readonly paymentService = inject(PaymentService);
    readonly methods = signal<PaymentMethod[]>([]);

    ngOnInit() {
        this.paymentService.getMethods().subscribe((m) => this.methods.set(m));
    }
}

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'rider-home',
    templateUrl: './rider_home.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule],
})
export class RiderHomeComponent {
    private readonly router = inject(Router);

    navigateToBooking() {
        this.router.navigate(['/rider/book']);
    }
}

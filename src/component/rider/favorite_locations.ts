import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'favorite-locations',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatButtonModule, MatIconModule],
    template: `
        <div class="page-container">
            <h2>Favorite Locations</h2>
            <mat-card style="margin-bottom:8px;"><mat-card-content><mat-icon>home</mat-icon> Home — Not set</mat-card-content></mat-card>
            <mat-card style="margin-bottom:8px;"><mat-card-content><mat-icon>work</mat-icon> Work — Not set</mat-card-content></mat-card>
            <button mat-raised-button class="accent" style="margin-top:16px;"><mat-icon>add</mat-icon> Add Location</button>
        </div>
    `,
})
export class FavoriteLocationsComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navigation } from 'component/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [Navigation],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}

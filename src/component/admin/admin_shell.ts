import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navigation } from 'component/navigation/navigation';

@Component({
  selector: 'admin-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navigation],
  template: `<app-navigation />`,
})
export class AdminShell {}

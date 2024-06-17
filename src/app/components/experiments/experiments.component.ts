import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperimentsComponent {}

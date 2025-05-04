import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-paper-links',
  templateUrl: './paper-links.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaperLinksComponent {
  @Input() article?: string;
  @Input() github?: string;
  @Input() cite?: string;
  @Input() documentation?: string;
  @Input() website?: string;
  @Input() event?: string;
}

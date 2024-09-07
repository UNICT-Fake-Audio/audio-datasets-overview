import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorComponent {
  @Input() fullName: string;
  @Input() profile: string;
  @Input() pictureUrl: string;
  @Input() scholar = '';
  @Input() linkedin = '';
}

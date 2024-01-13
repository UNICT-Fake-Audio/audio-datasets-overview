import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatasetVariationService } from '../../services/dataset-variation/dataset-variation.service';
import { Variation } from '../datasets/datasets.model';

@Component({
  selector: 'app-variation',
  templateUrl: './variation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationComponent {
  @Input() id: Variation;
  @Input() name: string;

  constructor(public readonly datasetVariationService: DatasetVariationService) {}
}

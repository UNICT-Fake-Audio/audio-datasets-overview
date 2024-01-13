import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatasetVariationService } from '../../services/dataset-variation/dataset-variation.service';
import { Variation } from '../datasets/datasets.model';

@Component({
  selector: 'app-dataset-variations',
  templateUrl: './dataset-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetVariationsComponent implements OnInit, OnDestroy {
  @Output() readonly datasetVariation = new EventEmitter<Variation>();

  readonly VARIATION = Variation;
  private readonly destroy$ = new Subject();

  constructor(private readonly datasetVariationService: DatasetVariationService) {}

  ngOnInit(): void {
    this.datasetVariationService.variation$.pipe(takeUntil(this.destroy$)).subscribe((variation: Variation) => {
      this.datasetVariation.emit(variation);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

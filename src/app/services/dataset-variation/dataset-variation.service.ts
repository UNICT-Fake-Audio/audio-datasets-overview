import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Variation } from '../../components/datasets/datasets.model';

@Injectable({
  providedIn: 'root',
})
export class DatasetVariationService {
  readonly variation$ = new Subject<Variation>();
}

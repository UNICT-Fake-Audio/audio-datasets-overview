import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PlotlyService } from 'angular-plotly.js';
import { PlotData, PlotlyDataLayoutConfig } from 'plotly.js-dist-min';
import { BehaviorSubject, from, shareReplay, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { PlaygroundService } from '../../services/playground.service';
import { Dataset, DATASETS, SYNTHETIC_LABELS } from '../home/home.model';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent implements OnChanges, OnDestroy {
  @Input() dataset: Dataset = DATASETS[1];
  @Input() feature = 'bitrate';
  @Input() grouped = true;

  @ViewChild('chart') plotlyGraph: any;

  constructor(
    private playgroundService: PlaygroundService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly plotly: PlotlyService,
  ) {
    this.initDataset();
  }

  private readonly sharedPlotParam = { x: [0], y: [0], type: 'scatter' as PlotData['type'], mode: 'lines' as PlotData['mode'], name: '' };
  private readonly unsubscribe$ = new Subject();
  private readonly readyLabels = new BehaviorSubject<boolean>(false);
  private labels: string[];

  graph: PlotlyDataLayoutConfig = {
    data: [
      { ...this.sharedPlotParam, marker: { color: 'blue' } },
      { ...this.sharedPlotParam, marker: { color: 'red' } },
    ],
    layout: { width: 800, height: 600, dragmode: 'pan', title: { text: `${this.dataset} - ${this.feature}`, xanchor: 'center' } },
    config: { scrollZoom: true },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataset'] && changes['dataset'].currentValue !== changes['dataset'].previousValue) {
      this.readyLabels.next(false);
      this.initDataset();
      this.refreshGraph();
    } else if (
      (changes['grouped'] && changes['grouped'].currentValue !== changes['grouped'].previousValue) ||
      (changes['feature'] && changes['feature'].currentValue !== changes['feature'].previousValue)
    ) {
      this.refreshGraph();
    }
  }

  private initDataset(): void {
    // const listFeatures = this.playgroundService.getFeatureHeadersFromDataset(this.dataset);
    this.playgroundService
      .getDataFromCsvZip(this.dataset, 'label')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((labels) => {
        this.labels = labels;
        this.readyLabels.next(true);
        // TODO: use listFeatures
      });
  }

  private refreshGraph(gruopedBins = true): void {
    this.readyLabels
      .pipe(
        filter((ready) => {
          console.log('trigger ready');
          return ready;
        }),
        switchMap((_) => from(this.playgroundService.getDataFromCsvZip(this.dataset, this.feature))),
        shareReplay(1),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((feature) => {
        console.log('feature', feature.length);
        const realData: number[] = [];
        const fakeData: number[] = [];
        for (let i = 0; i < this.labels.length; i++) {
          if (SYNTHETIC_LABELS.includes(this.labels[i])) {
            fakeData.push(Number(feature[i]));
          } else {
            realData.push(Number(feature[i]));
          }
        }

        const getData = gruopedBins ? this.playgroundService.elaborateData : this.playgroundService.elaborateDataV2;
        const { x: xReal, y: yReal } = getData.bind(this.playgroundService)(realData);
        const { x: xFake, y: yFake } = getData.bind(this.playgroundService)(fakeData);

        (this.graph.data[0] as Partial<PlotData>).x = xReal;
        (this.graph.data[0] as Partial<PlotData>).y = yReal;
        this.graph.data[0].name = `real (${realData.length})`;
        (this.graph.data[1] as Partial<PlotData>).x = xFake;
        (this.graph.data[1] as Partial<PlotData>).y = yFake;
        this.graph.data[1].name = `synthetic (${fakeData.length})`;

        this.cdRef.detectChanges();

        this.autoscale();
      });
  }

  private autoscale(): void {
    this.plotly.getPlotly().then((plotly) => {
      plotly.relayout(this.plotlyGraph.plotEl.nativeElement, {
        'xaxis.autorange': true,
        'yaxis.autorange': true,
        title: { text: `${this.dataset} - ${this.feature}`, xanchor: 'center' },
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}

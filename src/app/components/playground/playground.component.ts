import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { PlotlyService } from 'angular-plotly.js';
import { Font, Layout, PlotData, PlotlyDataLayoutConfig } from 'plotly.js-dist-min';
import { BehaviorSubject, Subject, combineLatest, from, tap } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { COLORS } from '../../app.model';
import { PlaygroundService } from '../../services/playground/playground.service';
import { DATASETS, DATASET_SMALLER_LABEL, Dataset, DatasetAlgorithmLabel, SYNTHETIC_LABELS } from '../datasets/datasets.model';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent implements OnDestroy {
  private _dataset: Dataset = DATASETS[1];
  @Input() set dataset(dataset: Dataset) {
    this.readyLabels.next(false);
    this._dataset = dataset;
    this.initDataset();
  }

  private _feature = 'amplitudes_cum_sum';
  @Input() set feature(feature: string) {
    this._feature = feature;
    this.refresh$.next(feature);
  }

  private _grouped = true;
  @Input() set grouped(grouped: boolean) {
    this._grouped = grouped;
    this.refresh$.next(grouped);
  }

  private _algorithm = true;
  @Input() set algorithm(algorithm: boolean) {
    this._algorithm = algorithm;
    this.refreshLabel$.next(algorithm);
  }

  @ViewChild('chart') plotlyGraph: any;

  isLoading = true;

  private readonly titleFont: Partial<Font> = { size: 25 };

  constructor(
    private readonly playgroundService: PlaygroundService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly plotly: PlotlyService,
  ) {
    this.initGraph();
  }

  private readonly sharedPlotParam = { x: [0], y: [0], type: 'scatter' as PlotData['type'], mode: 'lines' as PlotData['mode'], name: '' };
  private readonly unsubscribe$ = new Subject();
  private readonly readyLabels = new BehaviorSubject<boolean>(false);
  private readonly refresh$ = new Subject();
  private readonly refreshLabel$ = new BehaviorSubject<boolean>(false);
  private labels: string[];

  private getLayout: (dataset: Dataset, feature: string) => Partial<Layout> = (dataset, feature) => ({
    width: 1000,
    height: 650,
    dragmode: 'pan',
    showlegend: true,
    title: { font: this.titleFont, text: `${dataset} - ${feature}`, xanchor: 'center' },
    legend: {
      xanchor: 'right',
      font: {
        size: DATASET_SMALLER_LABEL.includes(dataset) && this._algorithm ? 14 : 23,
      },
    },
    xaxis: {
      autorange: true,
      title: {
        text: `${feature} value`,
        font: {
          size: 25,
        },
      },
    },
    yaxis: {
      autorange: true,
      title: {
        text: `number of utterances per value`,
        font: {
          size: 25,
        },
      },
    },
  });

  graph: PlotlyDataLayoutConfig = {
    data: [],
    layout: this.getLayout(this._dataset, this._feature),
    config: { scrollZoom: true, toImageButtonOptions: { format: 'svg' } },
  };

  private initDataset(): void {
    this.refreshLabel$
      .pipe(
        switchMap(() =>
          this.playgroundService
            .getDataFromCsvZip(
              this._dataset,
              this._algorithm && DatasetAlgorithmLabel[this._dataset] ? DatasetAlgorithmLabel[this._dataset] : 'label',
            )
            .pipe(takeUntil(this.unsubscribe$)),
        ),
      )
      .subscribe((labels) => {
        this.labels = labels;
        this.readyLabels.next(true);
      });
  }

  private initGraph(): void {
    combineLatest([this.readyLabels, this.refresh$])
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        filter(([ready, _]) => !!ready),
        switchMap((_) => from(this.playgroundService.getDataFromCsvZip(this._dataset, this._feature))),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((feature) => {
        this.isLoading = false;

        const datasetLabels = [...new Set(this.labels)];
        const graphData: number[][] = datasetLabels.map(() => []);

        let colorIdx = 0;
        const mapLabelIdx: { [label: string]: number } = {};

        this.graph.data = datasetLabels.map((label, labelIdx) => {
          const color = SYNTHETIC_LABELS.includes(label) ? 'red' : COLORS[colorIdx++];
          mapLabelIdx[label] = labelIdx;

          return { ...this.sharedPlotParam, name: label, marker: { color } };
        });

        const getData = this._grouped ? this.playgroundService.elaborateData : this.playgroundService.elaborateDataV2;

        for (let i = 0; i < this.labels.length; i++) {
          graphData[mapLabelIdx[this.labels[i]]].push(Number(feature[i]));
        }

        for (let i = 0; i < graphData.length; i++) {
          const { x, y } = getData.bind(this.playgroundService)(graphData[i]);

          const { setX, setY } = this.getSet(x, y); // remove duplicates

          (this.graph.data[i] as Partial<PlotData>).x = setX;
          (this.graph.data[i] as Partial<PlotData>).y = setY;
          this.graph.data[i].name = `${this.graph.data[i].name} (${graphData[i].length})`;
        }

        this.cdRef.detectChanges();

        this.autoscale();
      });
  }

  private autoscale(): void {
    this.plotly.getPlotly().then((plotly) => {
      plotly.relayout(
        this.plotlyGraph.plotEl.nativeElement,
        Object.assign(this.getLayout(this._dataset, this._feature), {
          title: { font: this.titleFont, text: `${this._dataset} - ${this._feature}`, xanchor: 'center' },
        }),
      );
    });
  }

  private getSet(arrX: number[], arrY: number[]): { setX: number[]; setY: number[] } {
    const mergedXY = [...new Set(arrX.map((x, idx) => `${x},${arrY[idx]}`))];
    const setX: number[] = [];
    const setY: number[] = [];
    mergedXY.forEach((xy) => {
      const [x, y] = xy.split(',');
      setX.push(Number(x));
      setY.push(Number(y));
    });

    return { setX, setY };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}

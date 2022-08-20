import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { PlotData, PlotlyDataLayoutConfig } from 'plotly.js-dist-min';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlaygroundService } from '../../services/playground.service';
import { Dataset, DATASETS } from '../home/home.model';
import { GraphData } from './playground.type';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent implements OnChanges, OnDestroy {
  @Input() dataset: Dataset = DATASETS[1];
  @Input() feature = 'bitrate';
  @Input() grouped = true;

  constructor(private playgroundService: PlaygroundService, private readonly cdRef: ChangeDetectorRef, private http: HttpClient) {
    this.initDataset();
    // this.refreshGraph();
  }

  private readonly sharedPlotParam = { x: [0], y: [0], type: 'scatter' as PlotData['type'], mode: 'lines' as PlotData['mode'], name: '' };
  private readonly unsubscribe$ = new Subject();
  private labels: string[];

  graph: PlotlyDataLayoutConfig = {
    data: [
      { ...this.sharedPlotParam, marker: { color: 'blue' } },
      { ...this.sharedPlotParam, marker: { color: 'red' } },
    ],
    layout: { width: 800, height: 600, dragmode: 'pan', title: 'sample plot' },
    config: { scrollZoom: true },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['grouped'] && changes['grouped'].currentValue !== changes['grouped'].previousValue) ||
      (changes['feature'] && changes['feature'].currentValue !== changes['feature'].previousValue)
    ) {
      // this.refreshGraph();
    }
  }

  private initDataset(): void {
    this.playgroundService.getDataFromCsvZip(this.dataset, 'label').then((labels) => {
      this.labels = labels;
      this.refreshGraph();
    });
    // TODO: subject to say that labels are ready
  }

  private refreshGraph(gruopedBins = true): void {
    this.playgroundService.getDataFromCsvZip(this.dataset, 'bfcc' /* this.feature */).then((feature) => {
      const realData: number[] = [];
      const fakeData: number[] = [];
      for (let i = 0; i < this.labels.length; i++) {
        if (this.labels[i] === 'spoof') {
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
      this.graph.data[1].name = `fake (${fakeData.length})`;

      this.cdRef.detectChanges();
    });
  }

  private OldRefreshGraph(): void {
    this.playgroundService
      .getData(this.dataset, this.feature, this.grouped)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: GraphData) => {
        (this.graph.data[0] as Partial<PlotData>).x = value.x_real;
        (this.graph.data[0] as Partial<PlotData>).y = value.y_real;
        this.graph.data[0].name = `real (${value.qty_real})`;
        (this.graph.data[1] as Partial<PlotData>).x = value.x_synthetic;
        (this.graph.data[1] as Partial<PlotData>).y = value.y_synthetic;
        this.graph.data[1].name = `fake (${value.qty_synthetic})`;

        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}

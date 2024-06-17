import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as JSZip from 'jszip';
import * as percentile from 'percentile';
import { catchError, from, map, Observable, shareReplay, switchMap } from 'rxjs';
import { DATASET_URL } from '../../app.model';
import { Dataset } from '../../components/datasets/datasets.model';
import { GraphData } from '../../components/playground/playground.type';
import { GenericObject, PlotData } from './playground.model';

@Injectable({
  providedIn: 'root',
})
export class PlaygroundService {
  constructor(private readonly http: HttpClient) {}

  readonly cachedRequests: Record<string, Observable<string[]>> = {};

  getData(dataset: string, feature: string, grouped = true): Observable<GraphData> {
    const fileName = grouped ? 'grouped_both' : 'both';
    return this.http.get<GraphData>(`assets/datasets/${dataset}/${feature}/${fileName}.json`);
  }

  getDataFromCsvZip(dataset: Dataset, feature: string): Observable<string[]> {
    const URL = `${DATASET_URL}${dataset}/${feature}.csv.zip`;

    if (!this.cachedRequests[URL]) {
      this.cachedRequests[URL] = this.http.get(URL, { responseType: 'arraybuffer' }).pipe(
        catchError((error: any) => {
          console.log('error', error);
          throw error;
        }),
        shareReplay(1),
        switchMap((fileZip) =>
          from(
            JSZip.loadAsync(fileZip)
              .then((zipData) =>
                zipData
                  .file(Object.keys(zipData.files).filter((f) => f != 'output/')[0])! // fix "Object is possibly 'null' "
                  .async('string'),
              )
              .then((csvData: string) => csvData.split('\n')),
          ),
        ),
      );
    }

    return this.cachedRequests[URL];
  }

  getFeatureHeadersFromDataset(dataset: Dataset): Observable<string[]> {
    return this.http.get(`${DATASET_URL}${dataset}/feature.csv`, { responseType: 'text' }).pipe(map((response) => response.split('\n')));
  }

  private getMinMax(values: number[]) {
    const [min, max] = values.reduce(
      ([_min, _max], val) => [Math.min(_min, val), Math.max(_max, val)],
      [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    );

    return [min, max];
  }

  private freedman_diaconis_bins(values: number[]): number {
    const [q25, q75] = percentile([25, 75], values) as number[];

    let binWidth = 2 * (q75 - q25) * values.length ** (-1 / 3);

    if (binWidth == 0) {
      binWidth = 30;
    }

    const [min, max] = this.getMinMax(values);

    let bins = Math.round((max - min) / binWidth);

    if (bins == 0) {
      bins = 30;
    }

    return bins;
  }

  private generateCurveFromHist(data: number[]): PlotData {
    const binWidth = this.freedman_diaconis_bins(data);

    const histogram = d3.bin().thresholds(binWidth);

    const bins = histogram(data);

    const plotValues = [];
    for (const bin of bins) {
      const [min, max] = this.getMinMax(bin);
      const val = (max + min) / 2;

      plotValues.push({
        x: isNaN(val) ? 0 : val,
        y: bin.length,
      });
    }

    plotValues.sort((a, b) => a.x - b.x);

    const x = plotValues.map((item) => item.x);
    const y = plotValues.map((item) => item.y);

    return { x, y };
  }

  elaborateData(stats: number[]): PlotData {
    for (let i = 0; i < stats.length; ++i) {
      if (isNaN(stats[i])) {
        stats[i] = 0;
      }
    }

    const { x, y } = this.generateCurveFromHist(stats);
    return { x, y };
  }

  elaborateDataV2(stats: number[]): PlotData {
    const y_stats: GenericObject = {};
    for (const s of stats) {
      if (!(s in y_stats)) {
        y_stats[s] = 1;
      } else {
        y_stats[s] += 1;
      }
    }

    const y_stats_ordered = Object.keys(y_stats)
      .sort()
      .reduce((obj: GenericObject, key: string | number) => {
        obj[key] = y_stats[key];
        return obj;
      }, {});

    const x = Object.keys(y_stats_ordered).map((_x) => Number(_x));
    const y = Object.values(y_stats_ordered);
    return { x, y };
  }
}

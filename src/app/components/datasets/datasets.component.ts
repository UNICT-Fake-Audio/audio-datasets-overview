import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { DATASET_URL, DataType, RealSynthetic, SPEAKERS_A01_A06, SPEAKERS_A07_A19, SYSTEM_IDS } from '../../app.model';
import { ASV19_FEATURES } from '../../asv19.model';
import {
  DATASETS,
  DATASETS_WITH_ALGORITHMS_LABEL,
  DATASETS_WITH_VARIATIONS,
  IGNORE_FEATURES,
  QueryParameters,
  Settings,
  Variation,
  systemIDs,
} from './datasets.model';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsComponent implements OnInit, OnDestroy {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly cdRef: ChangeDetectorRef,
  ) {}

  hasAlgorithms = true;
  hasVariations = false;

  FEATURES = ASV19_FEATURES;

  SYSTEM_IDS = SYSTEM_IDS;
  SPEAKERS_A01_A06 = SPEAKERS_A01_A06;
  SPEAKERS_A07_A19 = SPEAKERS_A07_A19;
  DATASETS = DATASETS;

  currentSystemId: systemIDs = SYSTEM_IDS[0];
  currentFeature: string = ASV19_FEATURES[0];
  currentSpeaker: string = SPEAKERS_A01_A06[0];

  settings: Settings = {
    grouped: true,
    dataset: DATASETS[0],
    realSyntheticState: RealSynthetic.BOTH,
    dataType: DataType.NORMAL_DATA,
    variation: Variation.DEFAULT,
    algorithm: false,
  };

  getFeatures$(): Observable<string[]> {
    return this.http.get(`${DATASET_URL}${this.settings.dataset}/feature.csv`, { responseType: 'text' }).pipe(
      map((file) =>
        file
          .split('\n')
          .filter((feature) => !IGNORE_FEATURES.includes(feature))
          .sort(),
      ),
    );
  }

  featurePerSpeaker = false;

  private readonly unsubscribe$ = new Subject();

  ngOnInit(): void {
    this.handleQueryParameters();
    this.updateQueryParameters();
  }

  selectSystem(event: any): void {
    this.currentSystemId = event.value;
    this.updateQueryParameters();
  }

  updateDataset(event: any): void {
    this.settings.dataset = event.value;
    this.hasAlgorithms = DATASETS_WITH_ALGORITHMS_LABEL.includes(this.settings.dataset);
    this.hasVariations = DATASETS_WITH_VARIATIONS.includes(this.settings.dataset);
    this.settings.algorithm = this.hasAlgorithms && this.settings.algorithm;

    this.updateFeatureList();
    this.updateQueryParameters();
  }

  updateFeature(event: any): void {
    this.currentFeature = event.value;
    this.updateQueryParameters();
  }

  updateSpeaker(event: any): void {
    this.currentSpeaker = event.value;
    this.updateQueryParameters();
  }

  updateFeaturePerSpeaker(value: boolean): void {
    this.featurePerSpeaker = value && this.settings.dataset === this.DATASETS[0];
    if (this.featurePerSpeaker) {
      this.setDefaultSpeakerPerSystem();
    }
    this.updateQueryParameters();
  }

  updateDataType(value: number): void {
    this.settings.dataType = value;
    this.updateQueryParameters();
  }

  updateAlgorithm(hasAlgorithm: boolean): void {
    this.settings.algorithm = hasAlgorithm;
    this.updateQueryParameters();
  }

  private setDefaultSpeakerPerSystem(): void {
    if (this.currentSystemId == 'A01_A06') {
      if (!SPEAKERS_A01_A06.includes(this.currentSpeaker)) {
        this.currentSpeaker = SPEAKERS_A01_A06[0];
        this.updateQueryParameters();
      }
    } else {
      if (!SPEAKERS_A07_A19.includes(this.currentSpeaker)) {
        this.currentSpeaker = SPEAKERS_A07_A19[0];
        this.updateQueryParameters();
      }
    }
  }

  private updateQueryParameters(): void {
    const queryParams: QueryParameters = {
      feature: this.currentFeature,
      system_id: this.currentSystemId,
      speaker: this.currentSpeaker,
      feature_per_speaker: this.featurePerSpeaker ? '1' : '0',
      dataType: this.settings.dataType,
      dataset: this.settings.dataset,
      algorithm: this.settings.algorithm,
    };

    this.router.navigate(['datasets'], { queryParams });
  }

  private handleQueryParameters(): void {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      const queryParameters = params as QueryParameters;

      if (queryParameters?.dataset) {
        this.updateDataset({ value: queryParameters?.dataset });
      }

      if (queryParameters?.feature_per_speaker) {
        this.updateFeaturePerSpeaker(queryParameters.feature_per_speaker == '1');
      }

      if (queryParameters?.feature) {
        this.updateFeature({ value: queryParameters.feature });
      }

      if (queryParameters?.system_id) {
        this.selectSystem({ value: queryParameters.system_id });
      }

      if (queryParameters?.speaker) {
        this.updateSpeaker({ value: queryParameters.speaker });
      }

      if (queryParameters?.dataType) {
        this.updateDataType(queryParameters?.dataType);
      }

      if (queryParameters?.algorithm) {
        this.updateAlgorithm(queryParameters?.algorithm);
      }
    });
  }

  private updateFeatureList(): void {
    if (this.settings.dataset !== 'ASVSPOOF_2019_LA') {
      this.getFeatures$()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((features) => {
          this.FEATURES = features;
          this.cdRef.detectChanges();
        });
    } else {
      this.FEATURES = ASV19_FEATURES;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}

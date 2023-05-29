import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataType, FEATURES, RealSynthetic, SPEAKERS_A01_A06, SPEAKERS_A07_A19, SYSTEM_IDS } from '../../app.model';
import { DATASETS, QueryParameters, Settings, systemIDs } from './datasets.model';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss'],
})
export class DatasetsComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private router: Router) {}

  FEATURES = FEATURES;
  SYSTEM_IDS = SYSTEM_IDS;
  SPEAKERS_A01_A06 = SPEAKERS_A01_A06;
  SPEAKERS_A07_A19 = SPEAKERS_A07_A19;
  DATASETS = DATASETS;

  currentSystemId: systemIDs = SYSTEM_IDS[0];
  currentFeature: string = FEATURES[0];
  currentSpeaker: string = SPEAKERS_A01_A06[0];

  settings: Settings = { grouped: true, dataset: DATASETS[0], realSyntheticState: RealSynthetic.BOTH, dataType: DataType.NORMAL_DATA };

  featurePerSpeaker = false;

  private readonly unsubscribe$ = new Subject();

  ngOnInit(): void {
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
    });

    this.updateQueryParameters();
  }

  selectSystem(event: any): void {
    this.currentSystemId = event.value;
    this.updateQueryParameters();
  }

  updateDataset(event: any): void {
    this.settings.dataset = event.value;
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
    };

    this.router.navigate(['datasets'], { queryParams });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}

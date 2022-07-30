import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DataType,
  FEATURES,
  RealSynthetic,
  SPEAKERS_A01_A06,
  SPEAKERS_A07_A19,
  SYSTEM_IDS,
} from '../app.model';
import { DATASETS, QueryParameters, systemIDs } from './home.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  FEATURES = FEATURES;
  SYSTEM_IDS = SYSTEM_IDS;
  SPEAKERS_A01_A06 = SPEAKERS_A01_A06;
  SPEAKERS_A07_A19 = SPEAKERS_A07_A19;
  DATASETS = DATASETS;

  currentSystemId: systemIDs = SYSTEM_IDS[0];
  currentFeature: string = FEATURES[0];
  currentSpeaker: string = SPEAKERS_A01_A06[0];

  realSyntheticState: RealSynthetic = RealSynthetic.BOTH;
  dataType: DataType = DataType.NORMAL_DATA;
  grouped = true;

  featurePerSpeaker = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const queryParameters = params as QueryParameters;

      if (queryParameters?.feature_per_speaker) {
        this.updateFeaturePerSpeaker(
          queryParameters.feature_per_speaker == '1'
        );
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

  updateFeature(event: any): void {
    this.currentFeature = event.value;
    this.updateQueryParameters();
  }

  updateSpeaker(event: any): void {
    this.currentSpeaker = event.value;
    this.updateQueryParameters();
  }

  updateFeaturePerSpeaker(value: boolean): void {
    this.featurePerSpeaker = value;
    if (this.featurePerSpeaker) {
      this.setDefaultSpeakerPerSystem();
    }
    this.updateQueryParameters();
  }

  updateDataType(value: number): void {
    this.dataType = value;
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
      dataType: this.dataType,
    };

    this.router.navigate([''], { queryParams });
  }
}

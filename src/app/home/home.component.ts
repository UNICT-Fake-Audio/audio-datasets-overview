import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  DataType,
  FEATURES,
  RealSynthetic,
  SPEAKERS_A01_A06,
  SPEAKERS_A07_A19,
  SYSTEM_IDS,
} from '../app.model';
import { QueryParameters } from './home.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  FEATURES = FEATURES;
  SYSTEM_IDS = SYSTEM_IDS;
  SPEAKERS_A01_A06 = SPEAKERS_A01_A06;
  SPEAKERS_A07_A19 = SPEAKERS_A07_A19;

  currentSystemId: string = SYSTEM_IDS[0];
  currentFeature: string = FEATURES[0];
  currentSpeaker: string = SPEAKERS_A01_A06[0];

  realSyntheticState: RealSynthetic = RealSynthetic.BOTH;
  dataType: DataType = DataType.NORMAL_DATA;
  grouped = true;

  featurePerSpeaker = false;

  querySettings = { systemId: null };

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
    });
  }

  selectSystem(event: any): void {
    this.currentSystemId = event.value;
  }

  updateFeature(event: any): void {
    this.currentFeature = event.value;
  }

  updateSpeaker(event: any): void {
    this.currentSpeaker = event.value;
  }

  updateFeaturePerSpeaker(value: boolean) {
    this.featurePerSpeaker = value;
  }
}

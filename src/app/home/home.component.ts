import { Component } from '@angular/core';
import {
  FEATURES,
  RealSynthetic,
  SPEAKERS_A01_A06,
  SPEAKERS_A07_A19,
  SYSTEM_IDS,
} from '../app.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  FEATURES = FEATURES;
  SYSTEM_IDS = SYSTEM_IDS;
  SPEAKERS_A01_A06 = SPEAKERS_A01_A06;
  SPEAKERS_A07_A19 = SPEAKERS_A07_A19;

  currentSystemId: string = SYSTEM_IDS[0];
  currentFeature: string = FEATURES[0];
  currentSpeaker: string = SPEAKERS_A01_A06[0];

  realSyntheticState: RealSynthetic = RealSynthetic.BOTH;
  grouped = true;

  featurePerSpeaker = false;

  selectSystem(event: any): void {
    this.currentSystemId = event.value;
  }

  updateFeature(event: any): void {
    this.currentFeature = event.value;
  }

  updateSpeaker(event: any): void {
    this.currentSpeaker = event.value;
  }
}

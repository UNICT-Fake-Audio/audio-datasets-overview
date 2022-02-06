import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  RealSynthetic,
  SPEAKERS_A01_A06,
  SPEAKERS_A07_A19,
} from '../app.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
})
export class GraphComponent implements OnInit, OnChanges {
  @Input() featureType: string;
  @Input() feature: string;
  @Input() systemId: string;
  @Input() speaker: string;
  @Input() grouped: boolean;
  @Input() realSyntheticState: RealSynthetic;

  IMG_URL = '';

  ngOnInit(): void {
    this.IMG_URL = `assets/data/${this.featureType}/${this.feature}/${
      this.systemId
    }${this.grouped ? '_grouped' : ''}.png`;
  }

  ngOnChanges(changes: any): void {
    if (changes.systemId?.currentValue != changes.systemId?.previousValue) {
      this.speaker =
        this.systemId == 'A01_A06' ? SPEAKERS_A01_A06[0] : SPEAKERS_A07_A19[0];
    }
    this.updateImgUrl();
  }

  private updateImgUrl(): void {
    let realOrSynthetic = '';
    if (this.realSyntheticState == RealSynthetic.REAL) {
      realOrSynthetic = '_real';
    } else if (this.realSyntheticState == RealSynthetic.SYNTHETIC) {
      realOrSynthetic = '_synthetic';
    }

    this.IMG_URL = `assets/data/${this.featureType}/${this.feature}/${
      this.featureType == 'features_per_speaker' ? this.speaker + '_' : ''
    }${this.systemId}${this.grouped ? '_grouped' : ''}${realOrSynthetic}.png`;
  }
}

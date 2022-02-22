import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  DataType,
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
  @Input() dataType: DataType;

  IMG_URL = '';

  ngOnInit(): void {
    this.IMG_URL = `assets/data/${this.getDataTypePathName()}/${this.feature}/${
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

    this.IMG_URL = `assets/data/${this.getDataTypePathName()}/${this.feature}/${
      this.featureType == 'features_per_speaker' ? this.speaker + '_' : ''
    }${this.systemId}${this.grouped ? '_grouped' : ''}${realOrSynthetic}.png`;
  }

  private getDataTypePathName(): string {
    if (
      this.featureType == 'features_per_speaker' &&
      this.dataType != DataType.NORMAL_DATA
    ) {
      return (
        (this.dataType == DataType.LOUD_NORM_DATA
          ? 'loud_norm_'
          : 'resample_bit_rate_') + this.featureType
      );
    }

    return this.featureType;
  }
}

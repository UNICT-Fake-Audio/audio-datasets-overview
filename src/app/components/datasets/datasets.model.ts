import { DataType, RealSynthetic } from '../../app.model';

export type systemIDs = 'A01_A06' | 'A07_A19';
export interface QueryParameters {
  feature: string;
  feature_per_speaker: '1' | '0';
  system_id: systemIDs;
  speaker: string;
  dataType: DataType;
  dataset?: Dataset;
}

export const DATASETS = [
  'ASVSPOOF_2019_LA',
  // 'ASVSPOOF_2019_LA_SILENCE',
  'ASVSPOOF_2019_LA_MP3_LOW',
  // 'ASVSPOOF_2019_LA_MP3_MEDIUM',
  // 'ASVSPOOF_2019_LA_MP3_HIGH',
  // 'ASVSPOOF_2021',
  // 'ASVSPOOF_2021_SILENCE',
  'FAKE_OR_REAL',
  'IN_THE_WILD',
  'FAD',
  'SOS',
  'TIMIT_TTS_CLEAN',
] as const;
export type Dataset = (typeof DATASETS)[number];

export const SYNTHETIC_LABELS = ['spoof', 'fake'];

export enum Variation {
  DEFAULT = 'default',
  SILENCE = 'silence',
  WHITE_NOISE = 'white_noise',
  WATER_NOISE = 'water_noise',
  WIND_NOISE = 'wind_noise',
  STREET_NOISE = 'street_noise',
  MP3_LOW = 'mp3-low',
  MP3_MEDIUM = 'mp3-medium',
  MP3_HIGH = 'mp3-high',
}

export interface Settings {
  grouped: boolean;
  dataset: Dataset;
  realSyntheticState: RealSynthetic;
  dataType: DataType;
  variation: Variation;
}

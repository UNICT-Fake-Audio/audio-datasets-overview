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
  'ASVSPOOF_2019_LA_ONLY_SILENCE',
  // 'ASVSPOOF_2019_LA_MP3_LOW',
  // 'ASVSPOOF_2019_LA_MP3_MEDIUM',
  // 'ASVSPOOF_2019_LA_MP3_HIGH',
  'ASVSPOOF_2021',
  'ASVSPOOF_2021_ONLY_SILENCE',
  'FAKE_OR_REAL',
  'FAKE_OR_REAL_ONLY_SILENCE',
  'IN_THE_WILD',
  'IN_THE_WILD_ONLY_SILENCE',
  'FAD',
  'TRUMP_OBAMA_MINI_DATASET',
] as const;
export type Dataset = typeof DATASETS[number];

export const SYNTHETIC_LABELS = ['spoof', 'fake'];

export interface Settings {
  grouped: boolean;
  dataset: Dataset;
  realSyntheticState: RealSynthetic;
  dataType: DataType;
}

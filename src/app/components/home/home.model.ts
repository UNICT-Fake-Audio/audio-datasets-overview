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

export const DATASETS = ['ASVSPOOF_2019_LA', 'ASVSPOOF_2021', 'FAKE_OR_REAL'] as const;

export type Dataset = typeof DATASETS[number];

export interface Settings {
  grouped: boolean;
  dataset: Dataset;
  realSyntheticState: RealSynthetic;
  dataType: DataType;
}

export type systemIDs = 'A01_A06' | 'A07_A19';
export interface QueryParameters {
  feature: string;
  feature_per_speaker: '1' | '0';
  system_id: systemIDs;
  speaker: string;
}

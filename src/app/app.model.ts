import { systemIDs } from './components/datasets/datasets.model';

export const enum RealSynthetic {
  BOTH,
  REAL,
  SYNTHETIC,
}

export const enum DataType {
  NORMAL_DATA,
  RESAMPLED_BIT_RATE__DATA,
  LOUD_NORM_DATA,
}

export const SPEAKERS_A01_A06 = ['LA_0069', 'LA_0070', 'LA_0071', 'LA_0072', 'LA_0073', 'LA_0074', 'LA_0075'];
export const SPEAKERS_A07_A19 = ['LA_0012', 'LA_0013', 'LA_0047', 'LA_0023', 'LA_0038'];

export const DATASET_URL = 'https://raw.githubusercontent.com/UNICT-Fake-Audio/features-archive/main/datasets/';

export const SYSTEM_IDS: systemIDs[] = ['A01_A06', 'A07_A19'];

export const COLORS = [
  'blue',
  'green',
  'orange',
  'slategray',
  'brown',
  'purple',
  'cyan',
  'fuchsia',
  'greenyellow',
  'pink',
  'salmon',
  'teal',
  'tan',
  'navy',
  'aqua',
  'blueviolet',
  'chartreuse',
  'chocolate',
  'darkgrey',
  'goldenrod',
  'darkgreen',
];

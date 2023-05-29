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

export const SYSTEM_IDS: systemIDs[] = ['A01_A06', 'A07_A19'];
export const FEATURES = [
  'frequencies_q75',
  'amplitudes_cum_sum',
  'bfcc',
  'bit_rate',
  'dfrange',
  // 'duration',
  'energy',
  'freqs_kurtosis',
  'freqs_skewness',
  'frequencies_q25',
  'frequencies_std',
  'gfcc',
  'imfcc',
  'iqr',
  'lfcc',
  'lpc',
  'lpcc',
  'maxdom',
  'maxfun',
  'mean_frequency',
  'meandom',
  'meanfun',
  'median_frequency',
  'mfcc',
  'mindom',
  'minfun',
  'mode_frequency',
  'modindex',
  'msrcc',
  'ngcc',
  'peak_frequency',
  'plp',
  'psrcc',
  'rms',
  'rplp',
  // 'signal',
  // 'size',
  // 'spectral_bandwidth',
  'spectral_centroid',
  'spectral_entropy',
  'spectral_flatness',
  'spectral_mean',
  'spectral_rms',
  'spectral_rolloff',
  'spectral_spread',
  'spectral_std',
  'spectrum',
  'zcr',
].sort();

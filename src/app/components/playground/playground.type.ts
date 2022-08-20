import { PlotData } from 'plotly.js-dist-min';

export interface GraphData {
  x_real: PlotData['x'];
  y_real: PlotData['y'];
  x_synthetic: PlotData['x'];
  y_synthetic: PlotData['y'];
  qty_real: number;
  qty_synthetic: number;
}

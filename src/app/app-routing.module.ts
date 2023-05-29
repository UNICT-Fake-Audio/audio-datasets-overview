import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'datasets', component: DatasetsComponent },
  // { path: 'experiments', component: ExperimentsComponent },
  // { path: 'info', component: InfoComponent },
  { path: 'playground', component: PlaygroundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

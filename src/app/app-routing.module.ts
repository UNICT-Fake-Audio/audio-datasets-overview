import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExperimentsComponent } from './components/experiments/experiments.component';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { PlaygroundComponent } from './components/playground/playground.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'experiments', component: ExperimentsComponent },
  { path: 'info', component: InfoComponent },
  { path: 'playground', component: PlaygroundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

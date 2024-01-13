import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlotlyModule } from 'angular-plotly.js';
import { NgxBootstrapIconsModule, github } from 'ngx-bootstrap-icons';
import { MarkdownModule } from 'ngx-markdown';
import * as PlotlyJS from 'plotly.js-dist-min';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatasetVariationsComponent } from './components/dataset-variations/dataset-variations.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { ExperimentsComponent } from './components/experiments/experiments.component';
import { GraphComponent } from './components/graph/graph.component';
import { InfoComponent } from './components/info/info.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { VariationComponent } from './components/variation/variation.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

PlotlyModule.plotlyjs = PlotlyJS;

const icons = { github };

@NgModule({
  declarations: [
    AppComponent,
    DatasetsComponent,
    NavbarComponent,
    GraphComponent,
    ExperimentsComponent,
    InfoComponent,
    PlaygroundComponent,
    HomeComponent,
    FooterComponent,
    DatasetVariationsComponent,
    VariationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    NgxBootstrapIconsModule.pick(icons),
    PlotlyModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryMapComponent } from './country-map/country-map.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
import { MediaKitComponent } from './media-kit/media-kit.component';
import { ApiDocsComponent } from './api-docs/api-docs.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';

const routes: Routes = [
  {
    path: 'country-map',
    component: CountryMapComponent
  },
  {
    path: 'case-studies',
    component: CaseStudiesComponent
  },
  {
    path: 'media-kit',
    component: MediaKitComponent
  },
  {
    path: 'api-docs',
    component: ApiDocsComponent
  },
  {
    path: 'accessibility',
    component: AccessibilityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentTrustRoutingModule { }
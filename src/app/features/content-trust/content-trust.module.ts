import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';

import { ContentTrustRoutingModule } from './content-trust-routing.module';
import { CountryMapComponent } from './country-map/country-map.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
import { StakeholderLogosComponent } from './stakeholder-logos/stakeholder-logos.component';
import { MediaKitComponent } from './media-kit/media-kit.component';
import { ApiDocsComponent } from './api-docs/api-docs.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CountryMapComponent,
    CaseStudiesComponent,
    StakeholderLogosComponent,
    MediaKitComponent,
    ApiDocsComponent,
    AccessibilityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContentTrustRoutingModule,
    SharedModule
  ],
  providers: [
    DatePipe,
    TitleCasePipe
  ],
  exports: [
    CountryMapComponent,
    StakeholderLogosComponent
  ]
})
export class ContentTrustModule { }
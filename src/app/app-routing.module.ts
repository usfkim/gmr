import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '', // ← this helps
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./features/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'search-practitioners',
    loadChildren: () => import('./features/search-practitioners/search-practitioners.module').then(m => m.SearchPractitionersModule)
  },
  {
    path: 'verification-portal',
    loadChildren: () => import('./features/verification-portal/verification-portal.module').then(m => m.VerificationPortalModule)
  },
  {
    path: 'licensing-info',
    loadChildren: () => import('./features/licensing-info/licensing-info.module').then(m => m.LicensingInfoModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./features/news-updates/news-updates.module').then(m => m.NewsUpdatesModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./features/contact-us/contact-us.module').then(m => m.ContactUsModule)
  },
  {
    path: '',
    loadChildren: () => import('./features/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/practitioner-dashboard/practitioner-dashboard.module').then(m => m.PractitionerDashboardModule)
  },
  {
    path: 'government',
    loadChildren: () => import('./features/government-portal/government-portal.module').then(m => m.GovernmentPortalModule)
  },
  {
    path: 'employer',
    loadChildren: () => import('./features/employer-portal/employer-portal.module').then(m => m.EmployerPortalModule)
  },
  {
    path: 'embassy',
    loadChildren: () => import('./features/embassy-portal/embassy-portal.module').then(m => m.EmbassyPortalModule)
  },
  {
    path: 'facility',
    loadChildren: () => import('./features/facility-portal/facility-portal.module').then(m => m.FacilityPortalModule)
  },
  {
    path: 'public-verification',
    loadChildren: () => import('./features/public-verification/public-verification.module').then(m => m.PublicVerificationModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule)
  },
  {
    path: 'country-map',
    loadChildren: () => import('./features/content-trust/content-trust.module').then(m => m.ContentTrustModule)
  },
  {
    path: 'case-studies',
    loadChildren: () => import('./features/content-trust/content-trust.module').then(m => m.ContentTrustModule)
  },
  {
    path: 'stakeholder-logos',
    loadChildren: () => import('./features/content-trust/content-trust.module').then(m => m.ContentTrustModule)
  },
  {
    path: 'media-kit',
    loadChildren: () => import('./features/content-trust/content-trust.module').then(m => m.ContentTrustModule)
  },
  {
    path: 'api-docs',
    loadChildren: () => import('./features/content-trust/content-trust.module').then(m => m.ContentTrustModule)
  },
  {
    path: 'accessibility',
    loadChildren: () => import('./features/content-trust/content-trust.module').then(m => m.ContentTrustModule)
  },
  {
    path: 'mfa-challenge',
    loadChildren: () => import('./core/security/security.module').then(m => m.SecurityModule)
  },
  {
    path: 'access-denied',
    loadChildren: () => import('./core/security/security.module').then(m => m.SecurityModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

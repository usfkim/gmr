import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsUpdatesComponent } from './news-updates.component';

const routes: Routes = [
  {
    path: '',
    component: NewsUpdatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsUpdatesRoutingModule { }

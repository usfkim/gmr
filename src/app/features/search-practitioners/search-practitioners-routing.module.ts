import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPractitionersComponent } from './search-practitioners.component';

const routes: Routes = [
  {
    path: '',
    component: SearchPractitionersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPractitionersRoutingModule { }

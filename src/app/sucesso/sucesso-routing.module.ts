import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SucessoPage } from './sucesso.page';

const routes: Routes = [
  {
    path: '',
    component: SucessoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SucessoPageRoutingModule {}

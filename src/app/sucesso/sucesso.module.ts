import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SucessoPageRoutingModule } from './sucesso-routing.module';

import { SucessoPage } from './sucesso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SucessoPageRoutingModule
  ],
  declarations: [SucessoPage]
})
export class SucessoPageModule {}

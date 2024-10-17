import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SenhaPageRoutingModule } from './senha-routing.module';

import { SenhaPage } from './senha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SenhaPageRoutingModule
  ],
  declarations: [SenhaPage]
})
export class SenhaPageModule {}

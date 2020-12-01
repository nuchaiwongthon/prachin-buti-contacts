import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OfficerPositionPage } from './officer-position.page';
import { CallNumber } from '@ionic-native/call-number/ngx';

const routes: Routes = [
  {
    path: '',
    component: OfficerPositionPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [OfficerPositionPage],
  providers: [CallNumber],
})
export class OfficerPositionPageModule {}

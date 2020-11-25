import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OfficerPhonePage } from './officer-phone.page';

const routes: Routes = [
  {
    path: '',
    component: OfficerPhonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OfficerPhonePage]
})
export class OfficerPhonePageModule {}

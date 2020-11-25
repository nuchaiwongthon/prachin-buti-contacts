import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OfficerMinistryPage } from './officer-ministry.page';

const routes: Routes = [
  {
    path: '',
    component: OfficerMinistryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OfficerMinistryPage]
})
export class OfficerMinistryPageModule {}

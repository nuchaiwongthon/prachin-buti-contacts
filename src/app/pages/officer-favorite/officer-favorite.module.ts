import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OfficerFavoritePage } from './officer-favorite.page';

const routes: Routes = [
  {
    path: '',
    component: OfficerFavoritePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OfficerFavoritePage]
})
export class OfficerFavoritePageModule {}

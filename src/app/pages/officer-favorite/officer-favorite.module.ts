import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OfficerFavoritePage } from './officer-favorite.page';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

const routes: Routes = [
  {
    path: '',
    component: OfficerFavoritePage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [OfficerFavoritePage],
  providers: [CallNumber, LaunchNavigator],
})
export class OfficerFavoritePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OfficerNotePage } from './officer-note.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
const routes: Routes = [
  {
    path: '',
    component: OfficerNotePage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [OfficerNotePage],
  providers: [CallNumber],
})
export class OfficerNotePageModule {}

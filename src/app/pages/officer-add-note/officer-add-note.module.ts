import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {OfficerAddNotePage} from './officer-add-note.page';

const routes: Routes = [
    {
        path: '',
        component: OfficerAddNotePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [OfficerAddNotePage]
})
export class OfficerAddNotePageModule {
}

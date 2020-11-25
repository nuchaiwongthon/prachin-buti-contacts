import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {path: '', loadChildren: './pages/login/login.module#LoginPageModule'},
    {path: 'select-register', loadChildren: './pages/select-register/select-register.module#SelectRegisterPageModule'},
    {path: 'customer-register', loadChildren: './pages/customer-register/customer-register.module#CustomerRegisterPageModule'},
    {path: 'officer-register', loadChildren: './pages/officer-register/officer-register.module#OfficerRegisterPageModule'},
    {path: 'admin-check-user', loadChildren: './pages/admin-check-user/admin-check-user.module#AdminCheckUserPageModule'},
    {path: 'admin-check-edit', loadChildren: './pages/admin-check-edit/admin-check-edit.module#AdminCheckEditPageModule'},
    {path: 'admin-ministry', loadChildren: './pages/admin-ministry/adm-ministry.module#AdmMinistryPageModule'},
    {path: 'admin-position', loadChildren: './pages/admin-position/adm-position.module#AdmPositionPageModule'},
    {path: 'admin-profile', loadChildren: './pages/admin-profile/adm-profile.module#AdmProfilePageModule'},
    {path: 'admin-edit-profile', loadChildren: './pages/admin-edit-profile/edit-profile.module#EditProfilePageModule'},
    {path: 'add-ministry', loadChildren: './pages/add-ministry/add-ministry.module#AddMinistryPageModule'},
    {path: 'add-position', loadChildren: './pages/add-position/add-position.module#AddPositionPageModule'},
    {path: 'officer-ministry', loadChildren: './pages/officer-ministry/officer-ministry.module#OfficerMinistryPageModule'},
    {path: 'officer-position', loadChildren: './pages/officer-position/officer-position.module#OfficerPositionPageModule'},
    {path: 'officer-phone', loadChildren: './pages/officer-phone/officer-phone.module#OfficerPhonePageModule'},
    {path: 'officer-note', loadChildren: './pages/officer-note/officer-note.module#OfficerNotePageModule'},
    {path: 'officer-favorite', loadChildren: './pages/officer-favorite/officer-favorite.module#OfficerFavoritePageModule'},
    {path: 'officer-add-note', loadChildren: './pages/officer-add-note/officer-add-note.module#OfficerAddNotePageModule'},
    {path: 'user-edit-profile', loadChildren: './pages/user-edit-profile/user-edit-profile.module#UserEditProfilePageModule'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}

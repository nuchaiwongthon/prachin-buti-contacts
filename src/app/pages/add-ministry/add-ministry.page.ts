import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoadingController, MenuController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'Firebase';

@Component({
    selector: 'app-add-ministry',
    templateUrl: './add-ministry.page.html',
    styleUrls: ['./add-ministry.page.scss'],
})
export class AddMinistryPage implements OnInit {

    public onAddMinisterForm: FormGroup;
    ref = firebase.database().ref('ministry/');

    name: string;

    ministry: any;
    isUpdate = false;
    titleName = 'เพิ่มข้อมูลกระทรวง';

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public loadingCtrl: LoadingController,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.ministry = this.router.getCurrentNavigation().extras.state.ministry;
                this.name = this.ministry.name;

                this.isUpdate = true;
                this.titleName = 'แก้ไขข้อมูลกระทรวง';
            }
        });
    }

    ngOnInit() {
        this.onAddMinisterForm = this.formBuilder.group({
            'name': [null, Validators.compose([
                Validators.required
            ])]
        });
    }

    addMinistry() {
        if (this.isUpdate) {
            firebase.database().ref('ministry/' + this.ministry.uid).update(this.onAddMinisterForm.value);
            this.navCtrl.navigateBack('/admin-ministry');
        } else {
            const newMinistry = this.ref.push();
            newMinistry.set(this.onAddMinisterForm.value);
            this.navCtrl.navigateBack('/admin-ministry');
        }
    }

    back() {
        this.navCtrl.navigateBack('/admin-ministry');
    }
}

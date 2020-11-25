import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, MenuController, NavController} from '@ionic/angular';
import * as firebase from 'Firebase';
import {snapshotToArray} from '../admin-ministry/adm-ministry.page';
import {NavigationExtras} from '@angular/router';

@Component({
    selector: 'app-adm-position',
    templateUrl: './adm-position.page.html',
    styleUrls: ['./adm-position.page.scss'],
})
export class AdmPositionPage implements OnInit {

    searchName = '';
    searchMinistry = '';

    officer = [];
    ref = firebase.database().ref('officer/');

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController
    ) {
        this.getAllPosition('', '');
    }

    getAllPosition(name: string, ministry: string) {
        this.ref.on('value', resp => {
            this.officer = [];
            resp.forEach(data => {
                const item = data.val();
                item.uid = data.key;
                if (item.name.includes(name) && item.ministry.includes(ministry)) {
                    this.officer.push(item);
                }
            });
            // this.officer = snapshotToArray(resp);
        });
    }

    ngOnInit() {
    }

    goToAddPosition() {
        this.navCtrl.navigateForward('/add-position');
    }

    searchWithName() {
        this.getAllPosition(this.searchName, '');
    }

    searchWithMinistry() {
        this.getAllPosition('', this.searchMinistry);
    }

    edit(position: any) {
        const navigationExtras: NavigationExtras = {
            state: {
                officer: position
            }
        };
        this.navCtrl.navigateForward('/add-position', navigationExtras);
    }

    async delete(key) {
        const alert = await this.alertCtrl.create({
            header: 'ยืนยัน!',
            message: 'คุณต้องการลบรายการนี้ใช่หรือไม่?',
            buttons: [
                {
                    text: 'ไม่ใช่',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('cancel');
                    }
                }, {
                    text: 'ใช่',
                    handler: () => {
                        firebase.database().ref('officer/' + key).remove();
                    }
                }
            ]
        });

        await alert.present();
    }
}

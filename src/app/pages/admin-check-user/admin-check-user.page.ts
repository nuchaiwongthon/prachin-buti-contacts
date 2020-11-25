import {Component, OnInit} from '@angular/core';
import {
    NavController,
    AlertController,
    MenuController,
    ToastController,
    PopoverController,
    ModalController
} from '@ionic/angular';
import * as firebase from 'Firebase';

@Component({
    selector: 'app-admin-check-user',
    templateUrl: './admin-check-user.page.html',
    styleUrls: ['./admin-check-user.page.scss'],
})
export class AdminCheckUserPage implements OnInit {

    users = [];
    ref = firebase.database().ref('user/');

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public popoverCtrl: PopoverController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController
    ) {
        this.getUsers();
    }

    getUsers() {
        this.ref.on('value', resp => {
            this.users = [];
            resp.forEach(snapshot => {
                const item = snapshot.val();
                if (item.verify === 0 && item.position === 1) {
                    this.users.push(item);
                }
            });
        });
    }

    ngOnInit() {
    }

    async view(user: any) {
        const userData = [];

        const name = 'ชื่อ: ' + user.name;
        userData.push({
            value: name,
            disabled: true
        });

        const address = 'ที่อยู่: ' + user.address;
        userData.push({
            value: address,
            disabled: true
        });

        const email = 'อีเมล: ' + user.email;
        userData.push({
            value: email,
            disabled: true
        });

        const alert = await this.alertCtrl.create({
            header: 'ข้อมูลผู้ใช้งาน',
            message: 'ข้อมูลผู้ใช้งานใหม่',
            inputs: userData,
            backdropDismiss: false,
            buttons: [
                {
                    text: 'ปิด',
                    role: 'cancel',
                    handler: () => {
                        console.log('close');
                    }
                }
            ]
        });
        alert.present();
    }

    async accept(uid: string) {
        const verify = {
            'verify': 1
        };
        firebase.database().ref('user/' + uid)
            .update(verify)
            .then(value => {
                this.getUsers();
            });
    }

    async denied(uid: string) {
        const verify = {
            'verify': 2
        };
        firebase.database().ref('user/' + uid)
            .update(verify)
            .then(value => {
                this.getUsers();
            });
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

}

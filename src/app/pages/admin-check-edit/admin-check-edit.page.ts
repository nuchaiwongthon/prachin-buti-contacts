import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from '@ionic/angular';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';

@Component({
  selector: 'app-admin-check-edit',
  templateUrl: './admin-check-edit.page.html',
  styleUrls: ['./admin-check-edit.page.scss'],
})
export class AdminCheckEditPage implements OnInit {
  updates = [];
  ref = firebase.database().ref('update_log/');

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.getUpdates();
  }

  getUpdates() {
    this.ref.on('value', (resp) => {
      this.updates = [];
      this.updates = snapshotToArray(resp);
    });
  }

  ngOnInit() {}

  async view(user: any) {
    const userData = [];

    const name = 'ชื่อ : ' + user.name_user;
    userData.push({
      value: name,
      disabled: true,
    });

    const address = 'ที่อยู่ : ' + user.address;
    userData.push({
      value: address,
      disabled: true,
    });

    if (user.email !== undefined) {
      const email = 'อีเมล : ' + user.email;
      userData.push({
        value: email,
        disabled: true,
      });
    }

    const alert = await this.alertCtrl.create({
      header: 'ข้อมูลผู้ใช้งาน',
      message: 'ข้อมูลการแก้ไขผู้ใช้งาน',
      inputs: userData,
      backdropDismiss: false,
      buttons: [
        {
          text: 'ปิด',
          role: 'cancel',
          handler: () => {
            console.log('close');
          },
        },
      ],
    });
    alert.present();
  }

  async accept(user: any) {
    await firebase
      .database()
      .ref('user/' + user.id_user)
      .update(user);
    await firebase
      .database()
      .ref('update_log/' + user.id_user)
      .remove()
      .then((data) => {
        this.getUpdates();
      });
  }

  async denied(user: any) {
    firebase
      .database()
      .ref('update_log/' + user.id_user)
      .remove()
      .then((value) => {
        this.getUpdates();
      });
  }
}

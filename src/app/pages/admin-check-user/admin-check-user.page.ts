import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from '@ionic/angular';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-admin-check-user',
  templateUrl: './admin-check-user.page.html',
  styleUrls: ['./admin-check-user.page.scss'],
})
export class AdminCheckUserPage implements OnInit {
  users = [];
  ref = firebase.database().ref('user/');

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController) {}

  getUsers() {
    this.users = [];
    this.ref
      .orderByChild('verify')
      .equalTo(0)
      .on(`value`, (resp) => {
        resp.forEach((snapshot) => {
          let item = snapshot.val();
          item.id_user = snapshot.key;
          if (item.id_type === 'UT00002') {
            this.users.push(item);
          }
        });
        console.log(this.users);
      });
  }

  ngOnInit() {}
  ionViewDidEnter() {
    this.getUsers();
  }

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

    const email = 'อีเมล : ' + user.email;
    userData.push({
      value: email,
      disabled: true,
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
          },
        },
      ],
    });
    alert.present();
  }

  async accept(id_user: string) {
    const verify = {
      verify: 1,
    };
    firebase
      .database()
      .ref('user/' + id_user)
      .update(verify);

    this.getUsers();
  }

  async denied(id_user: string) {
    const verify = {
      verify: 2,
    };
    firebase
      .database()
      .ref('user/' + id_user)
      .update(verify);
    this.getUsers();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
}

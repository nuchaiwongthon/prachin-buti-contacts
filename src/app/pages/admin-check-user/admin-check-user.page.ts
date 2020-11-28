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

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.getUsers();
  }

  getUsers() {
    this.ref
      .orderByChild('verify')
      .equalTo(0)
      .on('child_added', (resp) => {
        this.users = [];
        if (resp.val().id_type === 'UT00002') {
          this.users.push({
            id: resp.key,
            address: resp.val().address,
            email: resp.val().email,
            id_type: resp.val().id_type,
            name_user: resp.val().name_user,
            password: resp.val().password,
            uid: resp.val().uid,
            verify: resp.val().verify,
            // resp.val()
          });
        }
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
      .update(verify)
      .then((value) => {
        this.getUsers();
      });
  }

  async denied(id_user: string) {
    const verify = {
      verify: 2,
    };
    firebase
      .database()
      .ref('user/' + id_user)
      .update(verify)
      .then((value) => {
        this.getUsers();
      });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
}

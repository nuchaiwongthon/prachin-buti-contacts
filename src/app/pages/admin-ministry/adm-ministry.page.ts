import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import * as firebase from 'Firebase';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-adm-ministry',
  templateUrl: './adm-ministry.page.html',
  styleUrls: ['./adm-ministry.page.scss'],
})
export class AdmMinistryPage implements OnInit {
  ministry = [];
  ref = firebase.database().ref('ministry/');

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    this.ref.on('value', (resp) => {
      this.ministry = [];
      resp.forEach((snapshot) => {
        const item = snapshot.val();
        item.id = snapshot.key;
        this.ministry.push(item);
      });
      // this.ministry = snapshotToArray(resp);
    });
  }

  ngOnInit() {}

  goToAddMinistry() {
    this.navCtrl.navigateForward('/add-ministry');
  }

  edit(ministry: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        ministry: ministry,
      },
    };
    this.navCtrl.navigateForward('/add-ministry', navigationExtras);
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
          },
        },
        {
          text: 'ใช่',
          handler: () => {
            firebase
              .database()
              .ref('ministry/' + key)
              .remove();
          },
        },
      ],
    });

    await alert.present();
  }
}

export const snapshotToArray = (snapshot) => {
  const returnArr = [];
  snapshot.forEach((childSnapshot) => {
    const item = childSnapshot.val();
    item.id = childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;
};

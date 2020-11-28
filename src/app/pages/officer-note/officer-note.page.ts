import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-officer-note',
  templateUrl: './officer-note.page.html',
  styleUrls: ['./officer-note.page.scss'],
})
export class OfficerNotePage implements OnInit {
  notificationCount: number;
  notificationList = [];

  noteList = [];

  user: any;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, private callNumber: CallNumber, private launchNavigator: LaunchNavigator) {
    this.user = firebase.auth().currentUser;
  }

  getNotes() {
    this.noteList = [];
    firebase
      .database()
      .ref(`note/`)
      .orderByChild(`id_user`)
      .equalTo(localStorage.getItem('user'))
      .on('value', (data) => {
        data.forEach((dataSnapshot) => {
          const item = dataSnapshot.val();
          item.id_note = dataSnapshot.key;
          this.noteList.push(item);
        });
      });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getNotes();
    this.menuCtrl.enable(true);
  }

  async showNotification() {
    const notificationData = [];
    let itemCount = 1;
    if (this.notificationCount > 0) {
      this.notificationList.forEach((officer) => {
        const officerName = '' + itemCount + '. ' + officer.name_inc + ' ' + officer.name_po + ' (กระทรวง' + officer.ministry_name + ')';
        notificationData.push({
          value: officerName,
          disabled: true,
        });
        itemCount++;
      });
      const alert = await this.alertCtrl.create({
        header: 'แจ้งเตือนอัพเดตข้อมูลราชการ',
        message: 'มีข้อมูลราชการอัพเดตเพิ่ม ' + this.notificationCount + ' รายการ',
        inputs: notificationData,
        backdropDismiss: false,
        buttons: [
          {
            text: 'ปิด',
            role: 'cancel',
            handler: () => {
              this.notificationCount = 0;
              this.notificationList = [];
            },
          },
        ],
      });
      alert.present();
    }
  }

  goToAddNote() {
    this.navCtrl.navigateForward('/officer-add-note');
  }

  async actionDelete(uid: string) {
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
              .ref('note/' + this.user.uid + '/' + uid)
              .remove();
          },
        },
      ],
    });

    await alert.present();
  }

  actionEdit(note: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        note: note,
      },
    };
    this.navCtrl.navigateForward('/officer-add-note', navigationExtras);
  }

  actionCall(tel: string) {
    this.callNumber.callNumber(tel, true);
  }
}

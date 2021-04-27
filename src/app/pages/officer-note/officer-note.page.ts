import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';
import { NavigationExtras } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-officer-note',
  templateUrl: './officer-note.page.html',
  styleUrls: ['./officer-note.page.scss'],
})
export class OfficerNotePage implements OnInit {
  notificationShow = 0;
  notificationList = [];

  noteList = [];

  user: any;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, private callNumber: CallNumber) {
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
    this.notificationList.forEach((officer, index) => {
      notificationData.push({
        value: `${index + 1}. ${officer.name_inc} ${officer.name_po} (หน่วยงาน ${officer.ministry_name})`,
        disabled: true,
      });
    });
    const alert = await this.alertCtrl.create({
      header: 'แจ้งเตือนอัพเดตข้อมูลราชการ',
      message: 'มีข้อมูลราชการอัพเดตเพิ่ม ' + this.notificationShow + ' รายการ',
      inputs: notificationData,
      backdropDismiss: true,
      buttons: [
        {
          text: 'ปิด',
          role: 'cancel',
          handler: () => {
            this.notificationShow = 0;
            this.notificationList = [];
          },
        },
      ],
    });
    alert.present();
  }

  goToAddNote() {
    this.navCtrl.navigateForward('/officer-add-note');
  }

  async actionDelete(data: any) {
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
          handler: async () => {
            await firebase
              .database()
              .ref('note/')
              .child(data.id_note)
              .remove()
              .then((value) => {
                this.getNotes();
              });
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

  actionCall(tel: any) {
    if (tel.phone) {
      this.callNumber.callNumber(tel.phone, true);
    }
  }
}

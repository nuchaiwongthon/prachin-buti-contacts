import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';

@Component({
  selector: 'app-officer-phone',
  templateUrl: './officer-phone.page.html',
  styleUrls: ['./officer-phone.page.scss'],
})
export class OfficerPhonePage implements OnInit {
  notificationCount: number;
  notificationList = [];

  ministryList = [];
  officerList = [];
  favoriteList = [];

  searchTel = '';
  searchFax = '';

  user: any;

  ref = firebase.database().ref('position/');
  ref_inc = firebase.database().ref('incumbent/');
  ref_tel = firebase.database().ref('tel/');

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, private callNumber: CallNumber, private launchNavigator: LaunchNavigator) {
    this.user = firebase.auth().currentUser;
    firebase
      .database()
      .ref('position/')
      .on('child_added', (data) => {
        this.notificationCount++;
        this.notificationList.push(data.val());
      });
    firebase
      .database()
      .ref('ministry/')
      .on('value', (data) => {
        this.ministryList = [];
        this.ministryList = snapshotToArray(data);
      });
    //
  }
  search(tels: string, fax: string) {
    this.getOfficers(tels, fax);
  }
  ngOnInit() {}

  async getOfficers(tele: string, fax: string) {
    let position_arr = [];
    this.officerList = [];
    const position: any = await this.setDataPosition();
    const tel: any = await this.setDataTel();
    const inc: any = await this.setDataIncumbent();
    const fav: any = await this.setDataFav();

    position_arr = position;
    for (let index = 0; index < tel.length; index++) {
      let find_index_tel = position.findIndex((e) => e.id_position === tel[index].id_position);
      if (find_index_tel !== -1) {
        if (tel[index].type_tel === 'tel') {
          position_arr[find_index_tel].tel = tel[index].tel;
        }
        if (tel[index].type_tel === 'fax') {
          position_arr[find_index_tel].fax = tel[index].tel;
        }
        let asd = tel.map((e) => {
          if (e.id_position === position_arr[find_index_tel].id_position) {
            return e.id_tel;
          }
        });
        position_arr[find_index_tel].tel_id = asd.filter((e) => e !== undefined);
      }
    }

    for (let index = 0; index < position_arr.length; index++) {
      let find_index_inc = inc.findIndex((e) => e.id_position === position_arr[index].id_position);
      if (find_index_inc !== -1) {
        position_arr[index].id_inc = inc[find_index_inc].id_inc;
        position_arr[index].name_inc = inc[find_index_inc].name_inc;
      }
      let find_index_fav = fav.findIndex((e) => e.id_position === position_arr[index].id_position);
      if (find_index_fav !== -1) {
        position_arr[index].favorite = true;
        position_arr[index].id_fav = fav[find_index_fav].id_fav;
      } else {
        position_arr[index].favorite = false;
      }
    }
    for (let index = 0; index < position_arr.length; index++) {
      for (let j = 0; j < position_arr[index].tel.length; j++) {
        if (position_arr[index].tel[j].includes(tele) && position_arr[index].fax[j].includes(fax)) {
          if (this.officerList.findIndex((e) => e.name_inc === position_arr[index].name_inc) === -1) {
            this.officerList.push(position_arr[index]);
          }
        }
      }
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.getOfficers('', '');
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

  actionCall(tel: string) {
    this.callNumber.callNumber(tel, true);
  }

  actionMap(lat: string, lng: string) {
    const destination = [Number(lat), Number(lng)];
    this.launchNavigator.navigate(destination);
  }

  async actionFavorite(officer: any) {
    const id = (await this.getLastRecordFav()) ? await this.getLastRecordFav() : 0;
    if (officer.favorite) {
      await firebase
        .database()
        .ref('favorite/')
        .child(officer.id_fav)
        .remove()
        .then((value) => {
          this.getOfficers(this.searchTel, this.searchFax);
        });
    } else {
      firebase
        .database()
        .ref(`favorite/`)
        .child(`F0000${Number(id) + 1}`)
        .set({
          id_user: localStorage.getItem('user'),
          id_position: officer.id_position,
        })
        .then((value) => {
          this.getOfficers(this.searchTel, this.searchFax);
        });
    }
  }
  setDataTel() {
    return new Promise((resolve, reject) => {
      let data_set = [];
      this.ref_tel.on('value', (resp) => {
        resp.forEach((data) => {
          const item = data.val();
          item.id_tel = data.key;
          data_set.push(item);
        });
        resolve(data_set);
      });
    });
  }
  setDataPosition() {
    return new Promise((resolve, reject) => {
      let data_set = [];
      this.ref.on('value', (resp) => {
        resp.forEach((data) => {
          const item = data.val();
          item.id_position = data.key;
          data_set.push(item);
        });
        resolve(data_set);
      });
    });
  }
  setDataIncumbent() {
    return new Promise((resolve, reject) => {
      let data_set = [];
      this.ref_inc.on('value', (resp) => {
        let count = 1;
        resp.forEach((data) => {
          const item = data.val();
          item.id_inc = data.key;
          data_set.push(item);
        });

        resolve(data_set);
      });
    });
  }
  getLastRecordFav() {
    return new Promise(async (resolve, reject) => {
      let dataSet = [];
      await firebase
        .database()
        .ref(`favorite/`)
        .on(`value`, (resp) => {
          resp.forEach((snapshot) => {
            let item = snapshot.key;
            dataSet.push(Number(item.replace('F', '')));
          });
          let sort = dataSet.sort(function (a, b) {
            return b - a;
          });
          resolve(sort[0]);
        });
    });
  }
  setDataFav() {
    return new Promise((resolve, reject) => {
      let data_set = [];
      firebase
        .database()
        .ref(`favorite/`)
        .orderByChild(`id_user`)
        .equalTo(localStorage.getItem('user'))
        .on('value', (data) => {
          data.forEach((dataSnapshot) => {
            const item = dataSnapshot.val();
            item.id_fav = dataSnapshot.key;
            data_set.push(item);
          });
          resolve(data_set);
        });
    });
  }
}

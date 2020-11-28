import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-officer-ministry',
  templateUrl: './officer-ministry.page.html',
  styleUrls: ['./officer-ministry.page.scss'],
})
export class OfficerMinistryPage implements OnInit {
  notificationCount = 0;
  notificationShow = 0;
  notificationList = [];

  ministryList = [];
  officerList = [];
  favoriteList = [];

  searchName = '';

  user: any;

  ref = firebase.database().ref('officer/');
  ref_inc = firebase.database().ref('incumbent/');
  ref_tel = firebase.database().ref('tel/');
  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, private callNumber: CallNumber, private launchNavigator: LaunchNavigator) {
    this.user = firebase.auth().currentUser;
    firebase
      .database()
      .ref('officer/')
      .once('value', (data) => {
        data.forEach((snapshot) => {
          this.notificationCount++;
        });
      });
  }

  searchData(event: any) {
    const val = event.target.value;
    this.getOfficers(val);
  }

  async getOfficers(search) {
    let position_arr = [];
    const position: any = await this.setDataPosition(search);

    position_arr = position;
    if (position.length) {
      const tel: any = await this.setDataTel();
      const inc: any = await this.setDataIncumbent();
      const fav: any = await this.setDataFav();
      this.officerList = [];
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
      this.officerList = position_arr;
    }
  }
  ngOnInit() {
    firebase
      .database()
      .ref('ministry/')
      .on('value', (data) => {
        this.ministryList = [];
        this.ministryList = snapshotToArray(data);
        console.log(this.ministryList);
      });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.getOfficers('');
  }

  async showNotification() {
    const notificationData = [];
    let itemCount = 1;
    if (this.notificationShow > 0) {
      this.notificationList.forEach((officer) => {
        const officerName = '' + itemCount + '. ' + officer.name_inc + ' ' + officer.name_po + ' (กระทรวง' + officer.ministry_name + ')';
        notificationData.push({
          value: officerName,
          disabled: true,
        });
        itemCount++;
      });
      // this.notificationCount = 0;
      // this.notificationList = [];
      const alert = await this.alertCtrl.create({
        header: 'แจ้งเตือนอัพเดตข้อมูลราชการ',
        message: 'มีข้อมูลราชการอัพเดตเพิ่ม ' + this.notificationShow + ' รายการ',
        inputs: notificationData,
        backdropDismiss: false,
        buttons: [
          {
            text: 'ปิด',
            role: 'cancel',
            handler: () => {
              this.notificationCount += this.notificationShow;
              this.notificationShow = 0;
              this.notificationList = [];
            },
          },
        ],
      });
      alert.present();
    }
  }

  async actionCall(tel: string) {
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
          this.getOfficers(this.searchName);
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
          this.getOfficers(this.searchName);
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
  setDataPosition(search) {
    return new Promise((resolve, reject) => {
      let data_set = [];
      firebase
        .database()
        .ref(`officer/`)
        .orderByChild(`id_ministry`)
        .equalTo(search)
        .on('value', (data) => {
          data.forEach((dataSnapshot) => {
            const item = dataSnapshot.val();
            item.id_position = dataSnapshot.key;
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
          if (count > this.notificationCount) {
            this.notificationShow = count - this.notificationCount;
            // this.notificationCount++;
            this.notificationList.push(item);
            console.log('Notification Show: ' + this.notificationShow);
            console.log('Notification Count: ' + this.notificationCount);
          }
          count++;
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

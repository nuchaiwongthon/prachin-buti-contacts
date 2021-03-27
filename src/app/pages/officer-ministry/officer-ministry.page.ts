import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
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

  ref = firebase.database().ref('position/');
  ref_inc = firebase.database().ref('incumbent/');
  ref_tel = firebase.database().ref('tel/');

  slideOpts = {
    height: 150,
    slidesPerView: 2,
    spaceBetween: 1,
    setWrapperSize: true,
    centeredSlides: true,
    direction: 'horizontal',
    roundLengths: false,
    noSwipingClass: 'swiper-no-swiping',
  };
  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, private callNumber: CallNumber) {
    this.user = firebase.auth().currentUser;
    firebase
      .database()
      .ref('position/')
      .once('value', (data) => {
        data.forEach((snapshot) => {
          this.notificationCount++;
        });
      });
  }
  ionViewDidEnter() {
    this.getOfficers('');
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
      const min: any = await this.setDataMinistry();
      this.officerList = [];
      for (let index = 0; index < tel.length; index++) {
        let find_index_tel = position.findIndex((e) => e.id_position === tel[index].id_position);
        if (find_index_tel !== -1) {
          if (tel[index].type_tel === 'tel') {
            let more = '';
            position_arr[find_index_tel].tel = [];
            for (let j = 0; j < tel[index].tel.length; j++) {
              if (tel[index].tel[j].includes('ต่อ')) {
                const str = tel[index].tel[j];
                const n = str.indexOf('ต่อ');
                const res = str.substring(n, str.length);
                more = res.replace('ต่อ', '');
                tel[index].tel[j] = tel[index].tel[j].replace(res, '').trim();
              }

              position_arr[find_index_tel].tel.push({
                tel: tel[index].tel[j],
                more: more.trim().replace(':', ','),
              });
            }
          }
          if (tel[index].type_tel === 'fax') {
            let more = '';
            position_arr[find_index_tel].fax = [];
            for (let j = 0; j < tel[index].tel.length; j++) {
              if (tel[index].tel[j].includes('ต่อ')) {
                const str = tel[index].tel[j];
                const n = str.indexOf('ต่อ');
                const res = str.substring(n, str.length);
                more = res.replace('ต่อ', '');
                tel[index].tel[j] = tel[index].tel[j].replace(res, '').trim();
              }

              position_arr[find_index_tel].fax.push({
                fax: tel[index].tel[j],
                more: more.trim().replace(':', ','),
              });
            }
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
        let find_index_min = min.findIndex((e) => e.id_ministry === position_arr[index].id_ministry);
        if (find_index_min !== -1) {
          position_arr[index].name_min = min[find_index_min].name_min;
        }
        if (position_arr[index].id_ministry.includes(search)) {
          this.officerList.push(position_arr[index]);
        }
      }
    }
  }
  ngOnInit() {
    firebase
      .database()
      .ref('ministry/')
      .on('value', (data) => {
        this.ministryList = [];
        this.ministryList = snapshotToArray(data);
      });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  async showNotification() {
    const notificationData = [];
    let itemCount = 1;
    if (this.notificationShow > 0) {
      this.notificationList.forEach((officer) => {
        const officerName = '' + itemCount + '. ' + officer.name_inc + ' ' + officer.name_po + ' (หน่วยงาน' + officer.ministry_name + ')';
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

  async actionCall(tel: any) {
    console.log(tel);
    if (tel.tel) {
      this.callNumber.callNumber(tel.tel, true);
    }
    if (tel.fax) {
      this.callNumber.callNumber(tel.fax, true);
    }
  }

  actionMap(lat: string, lng: string) {
    const destination = [Number(lat), Number(lng)];
    // this.launchNavigator.navigate(destination);
    if (lat && lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    } else {
      alert('ไม่ได้ระบุตำแหน่ง');
    }
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
        .ref(`position/`)
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
  setDataMinistry() {
    return new Promise((resolve, reject) => {
      let data_set = [];
      firebase
        .database()
        .ref(`ministry/`)
        .on('value', (resp) => {
          let count = 1;
          resp.forEach((data) => {
            const item = data.val();
            item.id_ministry = data.key;
            data_set.push(item);
          });
          resolve(data_set);
        });
    });
  }
}

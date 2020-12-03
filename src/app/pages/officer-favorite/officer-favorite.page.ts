import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-officer-favorite',
  templateUrl: './officer-favorite.page.html',
  styleUrls: ['./officer-favorite.page.scss'],
})
export class OfficerFavoritePage implements OnInit {
  notificationCount = 0;
  notificationShow = 0;
  notificationList = [];

  officerList = [];
  favoriteList = [];

  user: any;

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

  async getOfficers(search) {
    // let fav_arr = [];

    const position: any = await this.setDataPosition();
    const tel: any = await this.setDataTel();
    const inc: any = await this.setDataIncumbent();
    const fav: any = await this.setDataFav();
    this.officerList = [];
    for (let index = 0; index < fav.length; index++) {
      fav[index].favorite = true;
      let find_index_po = position.findIndex((e) => e.id_position === fav[index].id_position);
      if (find_index_po !== -1) {
        fav[index].name_po = position[find_index_po].name_po;
        fav[index].ministry_name = position[find_index_po].ministry_name;
      }
      let find_index_inc = inc.findIndex((e) => e.id_position === fav[index].id_position);
      if (find_index_inc !== -1) {
        fav[index].name_inc = inc[find_index_inc].name_inc;
      }
    }
    for (let index = 0; index < tel.length; index++) {
      let find_index_tel = fav.findIndex((e) => e.id_position === tel[index].id_position);
      if (find_index_tel !== -1) {
        if (tel[index].type_tel === 'tel') {
          let more = '';
          fav[find_index_tel].tel = [];
          for (let j = 0; j < tel[index].tel.length; j++) {
            if (tel[index].tel[j].includes('ต่อ')) {
              const str = tel[index].tel[j];
              const n = str.indexOf('ต่อ');
              const res = str.substring(n, str.length);
              more = res.replace('ต่อ', '');
              tel[index].tel[j] = tel[index].tel[j].replace(res, '').trim();
            }

            fav[find_index_tel].tel.push({
              tel: tel[index].tel[j],
              more: more.trim().replace(':', ','),
            });
          }
        }
        if (tel[index].type_tel === 'fax') {
          let more = '';
          fav[find_index_tel].fax = [];
          for (let j = 0; j < tel[index].tel.length; j++) {
            if (tel[index].tel[j].includes('ต่อ')) {
              const str = tel[index].tel[j];
              const n = str.indexOf('ต่อ');
              const res = str.substring(n, str.length);
              more = res.replace('ต่อ', '');
              tel[index].tel[j] = tel[index].tel[j].replace(res, '').trim();
            }

            fav[find_index_tel].fax.push({
              fax: tel[index].tel[j],
              more: more.trim().replace(':', ','),
            });
          }
        }
        let asd = tel.map((e) => {
          if (e.id_position === fav[find_index_tel].id_position) {
            return e.id_tel;
          }
        });
        fav[find_index_tel].tel_id = asd.filter((e) => e !== undefined);
      }
    }
    this.officerList = fav;
  }
  ngOnInit() {}

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.getOfficers('');
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
    // this.launchNavigator.navigate(destination);
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
  }

  async actionFavorite(officer: any) {
    firebase;
    await firebase
      .database()
      .ref('favorite/')
      .child(officer.id_fav)
      .remove()
      .then((value) => {
        this.getOfficers('');
      });
  }
  setDataTel() {
    return new Promise((resolve, reject) => {
      let data_set = [];
      firebase
        .database()
        .ref(`tel/`)
        .on('value', (resp) => {
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
      firebase
        .database()
        .ref(`incumbent/`)
        .on('value', (resp) => {
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
            dataSet.push(Number(item.replace('T', '')));
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

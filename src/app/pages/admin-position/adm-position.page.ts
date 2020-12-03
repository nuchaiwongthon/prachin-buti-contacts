import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, NavController } from '@ionic/angular';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';
import { NavigationExtras } from '@angular/router';
import { SearchFilterPage } from './../modal/search-filter/search-filter.page';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-adm-position',
  templateUrl: './adm-position.page.html',
  styleUrls: ['./adm-position.page.scss'],
})
export class AdmPositionPage implements OnInit {
  searchName = '';
  searchMinistry = '';

  officer = [];
  ref = firebase.database().ref('position/');
  ref_inc = firebase.database().ref('incumbent/');
  ref_tel = firebase.database().ref('tel/');
  ref_min = firebase.database().ref('ministry/');

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {}

  ionViewDidEnter() {
    this.getAllPosition('', '');
  }
  async getAllPosition(name: string, ministry: string) {
    let position_arr = [];
    this.officer = [];
    const position: any = await this.setDataPosition();
    const tel: any = await this.setDataTel();
    const inc: any = await this.setDataIncumbent();
    const min: any = await this.setDataMinistry();

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
      let find_index_min = min.findIndex((e) => e.id_ministry === position_arr[index].id_ministry);
      if (find_index_min !== -1) {
        position_arr[index].name_min = min[find_index_min].name_min;
      }
    }
    for (let index = 0; index < position_arr.length; index++) {
      if (position_arr[index].name_po.includes(name) && position_arr[index].name_min.includes(ministry)) {
        this.officer.push(position_arr[index]);
      }
    }
  }

  async ngOnInit() {}

  goToAddPosition() {
    this.navCtrl.navigateForward('/add-position');
  }

  search(name: string, ministry: string) {
    this.getAllPosition(name, ministry);
  }

  edit(position: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        officer: position,
      },
    };
    this.navCtrl.navigateForward('/add-position', navigationExtras);
  }

  async delete(data) {
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
            this.delAllData(data);
          },
        },
      ],
    });

    await alert.present();
  }
  async delAllData(data) {
    for (const iterator of data.tel_id) {
      await firebase.database().ref('tel/').child(iterator).remove();
    }
    await firebase.database().ref('incumbent/').child(data.id_inc).remove();
    await firebase.database().ref('position/').child(data.id_position).remove();
    this.getAllPosition('', '');
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
        resp.forEach((data) => {
          const item = data.val();
          item.id_inc = data.key;
          data_set.push(item);
        });
        resolve(data_set);
      });
    });
  }
  setDataMinistry() {
    return new Promise((resolve, reject) => {
      let data_set = [];
      this.ref_min.on('value', (resp) => {
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

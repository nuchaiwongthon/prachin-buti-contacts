import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, NavController } from '@ionic/angular';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-adm-position',
  templateUrl: './adm-position.page.html',
  styleUrls: ['./adm-position.page.scss'],
})
export class AdmPositionPage implements OnInit {
  searchName = '';
  searchMinistry = '';

  officer = [];
  ref = firebase.database().ref('officer/');
  ref_inc = firebase.database().ref('incumbent/');
  ref_tel = firebase.database().ref('tel/');

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    this.getAllPosition('', '');
  }

  getAllPosition(name: string, ministry: string) {
    this.ref.on('value', (resp) => {
      this.officer = [];
      resp.forEach((data) => {
        const item = data.val();
        item.id_position = data.key;
        if (item.name.includes(name) && item.ministry_name.includes(ministry)) {
          this.officer.push(item);
        }
      });
      for (let index = 0; index < this.officer.length; index++) {
        // console.log(this.officer[index]);

        this.ref_inc
          .orderByChild('name_inc')
          .equalTo(this.officer[index].id_position)
          .on('child_added', (data) => {
            // console.log(data.val());
          });
      }
    });
  }

  async ngOnInit() {
    let position_arr = [];
    const position: any = await this.setDataPosition();
    const tel: any = await this.setDataTel();
    const inc: any = await this.setDataIncumbent();
    for (let index = 0; index < position.length; index++) {
      let find_index_tel = tel.findIndex((e) => e.id_position === position[index].id_position);

      if (find_index_tel !== -1) {
        position_arr.push({
          id_position: position[index].id_position,
          address: position[index].address,
          id_ministry: position[index].id_ministry,
          lat: position[index].lat,
          lng: position[index].lng,
          ministry_name: position[index].ministry_name,
          name: position[index].name,
          tel: tel[find_index_tel].tel,
          fax: tel[find_index_tel].fax,
        });
      }
    }
    for (let index = 0; index < position_arr.length; index++) {
      let find_index_inc = inc.findIndex((e) => e.id_position === position_arr[index].id_position);
      if (find_index_inc !== -1) {
        position_arr[index].name_inc = inc[find_index_inc].name_inc;
      }
    }
    this.officer = position_arr;
  }

  goToAddPosition() {
    this.navCtrl.navigateForward('/add-position');
  }

  searchWithName() {
    this.getAllPosition(this.searchName, '');
  }

  searchWithMinistry() {
    this.getAllPosition('', this.searchMinistry);
  }

  edit(position: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        officer: position,
      },
    };
    this.navCtrl.navigateForward('/add-position', navigationExtras);
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
              .ref('officer/' + key)
              .remove();
          },
        },
      ],
    });

    await alert.present();
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
}

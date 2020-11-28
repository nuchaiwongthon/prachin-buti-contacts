import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.page.html',
  styleUrls: ['./add-position.page.scss'],
})
export class AddPositionPage implements OnInit {
  ministryList = [];
  ref = firebase.database().ref('ministry/');
  refPosition = firebase.database().ref('position/');

  public onAddPositionForm: FormGroup;

  officer: any;
  titleName = 'เพิ่มข้อมูลตำแหน่งงาน';
  isUpdate = false;
  ministry_name: string;
  id_ministry: string;
  position: string;
  name: string;
  tel_p: string;
  fax_p: string;
  address: string;
  lat: string;
  lng: string;
  tel_all = [];
  tel_all_show: any = '';
  fax_all_show: any = '';
  fax_all = [];
  number_position_run: any = 0;
  number_tel_run: any = 0;
  number_inc_run: any = 0;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, public toastCtrl: ToastController) {
    this.ref.on('value', (resp) => {
      this.ministryList = [];
      this.ministryList = snapshotToArray(resp);
    });
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.officer = this.router.getCurrentNavigation().extras.state.officer;
        this.position = this.officer.name_inc;
        this.name = this.officer.name_po;

        this.address = this.officer.address;
        this.lat = this.officer.lat;
        this.lng = this.officer.long;
        this.isUpdate = true;
        this.titleName = 'แก้ไขข้อมูลตำแหน่งงาน';

        if (this.officer.tel) {
          this.tel_all_show = this.officer.tel ? this.officer.tel.join(',') + ',' : '';
        }
        if (this.officer.fax) {
          this.fax_all_show = this.officer.fax ? this.officer.fax.join(',') + ',' : '';
        }
      }
    });
  }

  ngOnInit() {
    if (this.officer) {
      this.id_ministry = this.officer.id_ministry;
    }
    this.onAddPositionForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      position: [null, Validators.compose([Validators.required])],
      tel: [null, Validators.compose([])],
      fax: [null, Validators.compose([])],
      address: [null, Validators.compose([Validators.required])],
      lat: [null, Validators.compose([Validators.required])],
      lng: [null, Validators.compose([Validators.required])],
      id_ministry: [null, Validators.compose([Validators.required])],
      tel_all: [null, Validators.compose([Validators.required])],
      fax_all: [null, Validators.compose([Validators.required])],
    });
  }
  addPhone() {
    if (this.tel_p) {
      this.tel_all_show += `${this.tel_p},`;
    }
    this.tel_p = '';
  }
  addFax() {
    if (this.fax_p) {
      this.fax_all_show += `${this.fax_p},`;
    }
    this.fax_p = '';
  }
  async addPosition() {
    if (this.isUpdate) {
      let data_set = [];
      let data_set_fax = [];
      if (this.officer.tel_id) {
        for (const iterator of this.officer.tel_id) {
          await firebase.database().ref('tel/').child(iterator).remove();
        }
        let tels = this.tel_all_show.split(',');

        for (let index = 0; index < tels.length; index++) {
          if (tels[index]) {
            let find_index = this.officer.tel.findIndex((e) => e === tels[index]);
            if (find_index === -1) {
              data_set.push(tels[index]);
            }
          }
        }
        let faxs = this.fax_all_show.split(',');

        for (let index = 0; index < faxs.length; index++) {
          if (faxs[index]) {
            let find_index = this.officer.fax.findIndex((e) => e === faxs[index]);
            if (find_index === -1) {
              data_set_fax.push(faxs[index]);
            }
          }
        }
        data_set = data_set.concat(this.officer.tel);
        data_set_fax = data_set_fax.concat(this.officer.fax);
      } else {
        let tels = this.tel_all_show.split(',');
        for (let index = 0; index < tels.length; index++) {
          if (tels[index]) {
            data_set.push(tels[index]);
          }
        }
        let faxs = this.fax_all_show.split(',');
        for (let index = 0; index < faxs.length; index++) {
          if (faxs[index]) {
            data_set_fax.push(faxs[index]);
          }
        }
      }

      if (data_set.length && data_set_fax) {
        await this.selectMinistry(this.ministryList);
        this.number_position_run = (await this.getLastRecordPosition()) !== undefined ? await this.getLastRecordPosition() : 0;
        this.number_inc_run = (await this.getLastRecordIncumbent()) !== undefined ? await this.getLastRecordIncumbent() : 0;
        delete this.onAddPositionForm.value.tel;
        delete this.onAddPositionForm.value.tel_all;
        delete this.onAddPositionForm.value.fax;
        delete this.onAddPositionForm.value.fax_all;
        delete this.onAddPositionForm.value.position;
        this.onAddPositionForm.value.ministry_name = this.ministry_name;
        await firebase
          .database()
          .ref('position/' + this.officer.id_position)
          .update({
            address: this.onAddPositionForm.value.address,
            id_ministry: this.onAddPositionForm.value.id_ministry,
            lat: this.onAddPositionForm.value.lat,
            long: this.onAddPositionForm.value.lng,
            ministry_name: this.onAddPositionForm.value.ministry_name,
            name_po: this.onAddPositionForm.value.name,
          });
        await firebase
          .database()
          .ref('incumbent/' + this.officer.id_inc)
          .update({ name_inc: this.position });
        this.addTelAll(data_set, data_set_fax);
      } else {
        this.showToast('ยังไม่ได้เพิ่มเบอร์โทร');
      }
    } else {
      let tels = this.tel_all_show.split(',');
      let data_set = [];
      for (let index = 0; index < tels.length; index++) {
        if (tels[index]) {
          data_set.push(tels[index]);
        }
      }
      let faxs = this.fax_all_show.split(',');
      let data_set_fax = [];
      for (let index = 0; index < faxs.length; index++) {
        if (faxs[index]) {
          data_set_fax.push(faxs[index]);
        }
      }
      if (data_set.length && data_set_fax) {
        this.number_position_run = (await this.getLastRecordPosition()) !== undefined ? await this.getLastRecordPosition() : 0;
        this.number_inc_run = (await this.getLastRecordIncumbent()) !== undefined ? await this.getLastRecordIncumbent() : 0;
        delete this.onAddPositionForm.value.tel;
        delete this.onAddPositionForm.value.tel_all;
        delete this.onAddPositionForm.value.fax;
        delete this.onAddPositionForm.value.fax_all;
        delete this.onAddPositionForm.value.position;
        this.onAddPositionForm.value.ministry_name = this.ministry_name;
        this.refPosition.child(`P0000${Number(this.number_position_run) + 1}`).set({
          address: this.onAddPositionForm.value.address,
          id_ministry: this.onAddPositionForm.value.id_ministry,
          lat: this.onAddPositionForm.value.lat,
          long: this.onAddPositionForm.value.lng,
          ministry_name: this.onAddPositionForm.value.ministry_name,
          name_po: this.onAddPositionForm.value.name,
        });

        firebase
          .database()
          .ref(`incumbent/`)
          .child(`I0000${Number(this.number_inc_run) + 1}`)
          .set({
            name_inc: this.position,
            id_position: `P0000${Number(this.number_position_run)}`,
          });
        this.addTelAll(data_set, data_set_fax);
      } else {
        this.showToast('ยังไม่ได้เพิ่มเบอร์โทร');
      }
    }
    this.navCtrl.navigateForward('/admin-position');
  }
  back() {
    this.navCtrl.navigateBack('/admin-position');
  }
  selectMinistry(item) {
    for (let index = 0; index < item.length; index++) {
      let find = item.findIndex((x) => x.id === this.id_ministry);

      if (find !== -1) {
        this.ministry_name = item[find].name_min;
      }
    }
  }
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }
  getLastRecordPosition() {
    return new Promise(async (resolve, reject) => {
      let dataSet = [];
      await firebase
        .database()
        .ref(`position/`)
        .on(`value`, (resp) => {
          resp.forEach((snapshot) => {
            let item = snapshot.key;
            dataSet.push(Number(item.replace('P', '')));
          });
          let sort = dataSet.sort(function (a, b) {
            return b - a;
          });

          this.number_position_run = sort ? sort[0] : 0;
          resolve(this.number_position_run);
        });
    });
  }
  getLastRecordTel() {
    return new Promise(async (resolve, reject) => {
      let dataSet = [];
      await firebase
        .database()
        .ref(`tel/`)
        .on(`value`, (resp) => {
          resp.forEach((snapshot) => {
            let item = snapshot.key;
            dataSet.push(Number(item.replace('T', '')));
          });
          let sort = dataSet.sort(function (a, b) {
            return b - a;
          });
          this.number_tel_run = sort ? sort[0] : 0;
          resolve(this.number_tel_run);
        });
    });
  }
  getLastRecordIncumbent() {
    return new Promise(async (resolve, reject) => {
      let dataSet = [];
      await firebase
        .database()
        .ref(`incumbent/`)
        .on(`value`, (resp) => {
          resp.forEach((snapshot) => {
            let item = snapshot.key;
            dataSet.push(Number(item.replace('I', '')));
          });
          let sort = dataSet.sort(function (a, b) {
            return b - a;
          });
          this.number_inc_run = sort ? sort[0] : 0;
          resolve(this.number_inc_run);
        });
    });
  }
  async addTelAll(tel, fax) {
    this.number_tel_run = (await this.getLastRecordTel()) !== undefined ? await this.getLastRecordTel() : 0;

    await firebase
      .database()
      .ref(`tel/`)
      .child(`T0000${Number(this.number_tel_run) + 1}`)
      .set({
        id_position: `P0000${Number(this.number_position_run)}`,
        type_tel: 'fax',
        tel: fax,
      });
    this.number_tel_run = (await this.getLastRecordTel()) !== undefined ? await this.getLastRecordTel() : 0;
    await firebase
      .database()
      .ref(`tel/`)
      .child(`T0000${Number(this.number_tel_run) + 1}`)
      .set({
        id_position: `P0000${Number(this.number_position_run)}`,
        type_tel: 'tel',
        tel: tel,
      });
  }
}

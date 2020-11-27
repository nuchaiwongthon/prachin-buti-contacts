import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../admin-ministry/adm-ministry.page';

@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.page.html',
  styleUrls: ['./add-position.page.scss'],
})
export class AddPositionPage implements OnInit {
  ministryList = [];
  ref = firebase.database().ref('ministry/');
  refPosition = firebase.database().ref('officer/');

  public onAddPositionForm: FormGroup;

  officer: any;
  titleName = 'เพิ่มข้อมูลตำแหน่งงาน';
  isUpdate = false;
  ministry_name: string;
  id_ministry: string;
  position: string;
  name: string;
  tel_p: string;
  fax: string;
  address: string;
  lat: string;
  lng: string;
  tel_all = [];
  tel_all_show: string = '';
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
        this.position = this.officer.position;
        this.name = this.officer.name;
        // this.tel = this.officer.tel;
        this.fax = this.officer.fax;
        this.address = this.officer.address;
        this.lat = this.officer.lat;
        this.lng = this.officer.lng;
        this.isUpdate = true;
        this.titleName = 'แก้ไขข้อมูลตำแหน่งงาน';
        this.tel_all_show = this.officer.tel_all;
        this.id_ministry = this.officer.id_ministry;
      }
    });
  }

  ngOnInit() {
    this.onAddPositionForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      position: [null, Validators.compose([Validators.required])],
      tel: [null, Validators.compose([])],
      fax: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required])],
      lat: [null, Validators.compose([Validators.required])],
      lng: [null, Validators.compose([Validators.required])],
      id_ministry: [null, Validators.compose([Validators.required])],
      tel_all: [null, Validators.compose([Validators.required])],
    });
  }
  addPhone() {
    if (this.tel_p) {
      this.tel_all_show += `${this.tel_p},`;
    }
    this.tel_p = '';
  }
  async addPosition() {
    if (this.isUpdate) {
      await firebase
        .database()
        .ref('officer/' + this.officer.id_position)
        .update(this.onAddPositionForm.value);
      this.navCtrl.navigateBack('/admin-position');
    } else {
      let tels = this.tel_all_show.split(',');
      let data_set = [];
      for (let index = 0; index < tels.length; index++) {
        if (tels[index]) {
          data_set.push(tels[index]);
        }
      }
      if (data_set.length) {
        this.number_position_run = await this.getLastRecordPosition();
        this.number_tel_run = await this.getLastRecordTel();
        this.number_inc_run = await this.getLastRecordIncumbent();
        delete this.onAddPositionForm.value.tel;
        delete this.onAddPositionForm.value.tel_all;
        delete this.onAddPositionForm.value.fax;
        delete this.onAddPositionForm.value.position;
        this.onAddPositionForm.value.ministry_name = this.ministry_name;
        this.refPosition.child(`P0000${Number(this.number_position_run) + 1}`).set(this.onAddPositionForm.value);
        firebase
          .database()
          .ref(`incumbent/`)
          .child(`I0000${Number(this.number_inc_run) + 1}`)
          .set({
            name_inc: this.position,
            id_position: `P0000${Number(this.number_position_run)}`,
          });
        firebase
          .database()
          .ref(`tel/`)
          .child(`T0000${Number(this.number_tel_run) + 1}`)
          .set({
            id_position: `P0000${Number(this.number_position_run)}`,
            tel: data_set,
            fax: this.fax,
          });
        this.navCtrl.navigateBack('/admin-position');
      } else {
        this.showToast('ยังไม่ได้เพิ่มเบอร์โทร');
      }
    }
  }
  back() {
    this.navCtrl.navigateBack('/admin-position');
  }
  selectMinistry(item, e) {
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
      await firebase
        .database()
        .ref(`officer/`)
        .limitToLast(1)
        .on(`value`, (resp) => {
          resp.forEach((snapshot) => {
            console.log(snapshot);
            let item = snapshot.key;
            this.number_position_run = Number(item.replace('P', ''));
          });
          resolve(this.number_position_run);
        });
    });
  }
  getLastRecordTel() {
    return new Promise(async (resolve, reject) => {
      await firebase
        .database()
        .ref(`tel/`)
        .limitToLast(1)
        .on(`value`, (resp) => {
          resp.forEach((snapshot) => {
            let item = snapshot.key;
            this.number_tel_run = Number(item.replace('T', ''));
          });
          resolve(this.number_tel_run);
        });
    });
  }
  getLastRecordIncumbent() {
    return new Promise(async (resolve, reject) => {
      await firebase
        .database()
        .ref(`incumbent/`)
        .limitToLast(1)
        .on(`value`, (resp) => {
          resp.forEach((snapshot) => {
            let item = snapshot.key;
            this.number_inc_run = Number(item.replace('I', ''));
          });
          resolve(this.number_inc_run);
        });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-officer-register',
  templateUrl: './officer-register.page.html',
  styleUrls: ['./officer-register.page.scss'],
})
export class OfficerRegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  number: string;
  fullname: any;
  address: any;
  incumbent: any;
  id_card: any;
  position: any;
  ministry: any;
  tel: any;
  email: any;
  password: any;
  rePassword: any;
  dataRun: any = 0;
  ref = firebase.database().ref('user/');

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    let dataSet = [];
    firebase
      .database()
      .ref(`user/`)
      .on(`value`, (resp) => {
        resp.forEach((snapshot) => {
          let item = snapshot.key;
          dataSet.push(Number(item.replace('U', '')));
        });
        let sort = dataSet.sort(function (a, b) {
          return b - a;
        });
        this.dataRun = sort[0];
      });
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      fullName: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required])],
      incumbent: [null, Validators.compose([Validators.required])],
      id_card: [null, Validators.compose([Validators.required])],
      position: [null, Validators.compose([Validators.required])],
      ministry: [null, Validators.compose([Validators.required])],
      tel: [null, Validators.compose([Validators.required])],
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      're-password': [null, Validators.compose([Validators.required])],
    });
  }

  async doRegister() {
    if (this.password === this.rePassword) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((value) => {
          firebase
            .database()
            .ref(`user/`)
            .child(`U0000${Number(this.dataRun ? this.dataRun : 0) + 1}`)
            .set({
              name_user: this.fullname,
              address: this.address,
              email: this.email,
              password: this.password,
              verify: 0,
              id_type: `UT00002`,
              uid: value.user.uid,
              incumbent: this.incumbent,
              id_card: this.id_card,
              position: this.position,
              ministry: this.ministry,
              tel: this.tel,
            })
            .then((isSuccess) => {
              this.showAlert('ลงทะเบียนสำเร็จ', 'ขอบคุณสำหรับข้อมูล\nรอเจ้าหน้าที่ทำการตรวจสอบ');
            })
            .catch((err) => {
              this.showToast(err.message);
            });
        })
        .catch((err) => {
          this.showToast(err.message);
        });
    } else {
      this.showToast('รหัสผ่านไม่ตรงกัน');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'ปิด',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.navCtrl.navigateRoot('/');
          },
        },
      ],
    });
    await alert.present();
  }

  back() {
    this.navCtrl.navigateBack('/select-register');
  }
}

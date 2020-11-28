import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.page.html',
  styleUrls: ['./customer-register.page.scss'],
})
export class CustomerRegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  number: string;
  fullname: any;
  address: any;
  email: any;
  password: any;
  rePassword: any;
  dataRun: any = 0;

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

  async ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      fullName: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required])],
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      're-password': [null, Validators.compose([Validators.required])],
    });
  }

  doRegister() {
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
              id_type: `UT00003`,
              uid: value.user.uid,
            })
            .then((isSuccess) => {
              // this.showAlert('ลงทะเบียนสำเร็จ', 'ขอบคุณสำหรับข้อมูล\nรอเจ้าหน้าที่ทำการตรวจสอบ');
              this.navCtrl.navigateRoot('/');
            })
            .catch((err) => {
              this.showToast(err.message);
            });
          //   const newUser = firebase.database().ref("user/" + `U0000${this.number}`);
          //   const isData = {
          //     name: this.fullname,
          //     address: this.address,
          //     email: this.email,
          //     password: this.password,
          //     verify: 1,
          //     id_type: "UT00003",
          //   };
          //   newUser
          //     .set(isData)
          //     .then((isSuccess) => {
          //       // this.showAlert('ลงทะเบียนสำเร็จ', 'ขอบคุณสำหรับข้อมูล\nรอเจ้าหน้าที่ทำการตรวจสอบ');
          //       this.navCtrl.navigateRoot("/");
          //     })
          //     .catch((err) => {
          //       this.showToast(err.message);
          //     });
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
    this.navCtrl.navigateRoot('/select-register');
  }
}

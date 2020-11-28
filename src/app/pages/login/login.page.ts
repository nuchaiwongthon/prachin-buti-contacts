import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;

  user: any;

  email: any;
  password: any;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public toastCtrl: ToastController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    // this.user = firebase.auth().currentUser;
    // if (this.user !== null) {
    //     const email = this.user.email;
    //     if (email === 'admin@gmail.com') {
    //         this.navCtrl.navigateRoot('/admin-check-user');
    //     } else {
    //         firebase.database().ref('user/' + this.user.uid).on('value', snapshot => {
    //             const userData = snapshot.val();
    //             if (userData.verify === 0) {
    //                 this.showToast('รอเจ้าหน้าที่ทำการตรวจสอบ');
    //                 firebase.auth().signOut();
    //             } else if (userData.verify === 2) {
    //                 this.showToast('บัญชีผู้ใช้งานนี้ถูกระงับการให้บริการ');
    //                 firebase.auth().signOut();
    //             } else {
    //                 if (userData.position === 0) {
    //                     this.navCtrl.navigateRoot('/officer-ministry');
    //                 } else {
    //                     this.navCtrl.navigateRoot('/officer-ministry');
    //                 }
    //             }
    //         });
    //     }
    // }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000,
            });

            loader.present();
            loader.onWillDismiss().then(async (l) => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom',
              });

              toast.present();
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/select-register');
  }

  async goToHome() {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((value) => {
          this.user = firebase.auth().currentUser;
          if (this.user !== null) {
            const email = this.user.email;
            const ref = firebase.database().ref('user/');
            firebase.database();
            ref
              .orderByChild('email')
              .equalTo(email)
              .on('child_added', (data) => {
                localStorage.setItem('user', data.key);
                if (data.val().email && data.val().password === this.password) {
                  if (data.val().id_type === 'UT00001' || data.val().id_type === 'UT00002') {
                    if (data.val().verify === 0) {
                      this.showToast('รอเจ้าหน้าที่ทำการตรวจสอบ');
                      firebase.auth().signOut();
                    } else if (data.val().verify === 2) {
                      this.showToast('บัญชีผู้ใช้งานนี้ถูกระงับการให้บริการ');
                      firebase.auth().signOut();
                    } else {
                      if (data.val().id_type === 'UT00001') {
                        this.navCtrl.navigateRoot('/admin-check-user');
                      } else {
                        this.navCtrl.navigateRoot('/officer-ministry');
                      }
                    }
                  } else {
                    this.navCtrl.navigateRoot('/officer-ministry');
                  }
                } else {
                  this.showToast('บัญชีผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                }
              });
          } else {
            this.showToast('ไม่มีผู้ใช้งานนี้ในระบบ');
            firebase.auth().signOut();
          }

          // firebase
          //   .database()
          //   .ref('user/' + this.user.uid)
          //   .on('value', (snapshot) => {
          //     const userData = snapshot.val();
          //     console.log(userData);
          //     if (userData.verify === 0) {
          //       this.showToast('รอเจ้าหน้าที่ทำการตรวจสอบ');
          //       firebase.auth().signOut();
          //     } else if (userData.verify === 2) {
          //       this.showToast('บัญชีผู้ใช้งานนี้ถูกระงับการให้บริการ');
          //       firebase.auth().signOut();
          //     } else {
          //       if (userData.position === 0) {
          //         this.navCtrl.navigateRoot('/officer-ministry');
          //       } else {
          //         this.navCtrl.navigateRoot('/officer-ministry');
          //       }
          //     }
          //   });
        })
        .catch((e) => {
          this.showToast(e.code);
        });
    } catch (error) {
      this.showToast(error);
    }
  }
}

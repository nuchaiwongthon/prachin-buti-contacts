import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, MenuController, NavController, ToastController} from '@ionic/angular';
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
    email: any;
    password: any;
    rePassword: any;

    ref = firebase.database().ref('user/');

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public loadingCtrl: LoadingController,
        private formBuilder: FormBuilder,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController
    ) {
        firebase.database().ref('user/').on('value', resp => {
            let count = 1;
            resp.forEach(snapshot => {
                const item = snapshot.val();
                if (item.position === 1) {
                    count++;
                }
            });
            this.number = count.toString();
        });
    }

    ngOnInit() {
        this.onRegisterForm = this.formBuilder.group({
            'fullName': [null, Validators.compose([
                Validators.required
            ])],
            'address': [null, Validators.compose([
                Validators.required
            ])],
            'username': [null, Validators.compose([
                Validators.required
            ])],
            'password': [null, Validators.compose([
                Validators.required
            ])],
            're-password': [null, Validators.compose([
                Validators.required
            ])]
        });
    }

    async doRegister() {
        if (this.password === this.rePassword) {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(value => {
                    const newUser = firebase.database().ref('user/' + value.user.uid);
                    const isData = {
                        uid: value.user.uid,
                        name: this.fullname,
                        address: this.address,
                        email: this.email,
                        position: 1,
                        verify: 0
                    };
                    newUser.set(isData).then(isSuccess => {
                        this.showAlert('ลงทะเบียนสำเร็จ', 'ขอบคุณสำหรับข้อมูล\nรอเจ้าหน้าที่ทำการตรวจสอบ');
                    }).catch(err => {
                        this.showToast(err.message);
                    });
                })
                .catch(err => {
                    this.showToast(err.message);
                });
        } else {
            this.showToast('รหัสผ่านไม่ตรงกัน');
        }
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 3000
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
                    }
                }
            ]
        });
        await alert.present();
    }

    back() {
        this.navCtrl.navigateBack('/select-register');
    }

}

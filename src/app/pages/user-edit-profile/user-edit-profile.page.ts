import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, MenuController, NavController, ToastController} from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
    selector: 'app-user-edit-profile',
    templateUrl: './user-edit-profile.page.html',
    styleUrls: ['./user-edit-profile.page.scss'],
})
export class UserEditProfilePage implements OnInit {

    public onRegisterForm: FormGroup;

    fullname = '';
    address = '';
    email = '';
    password = '';
    newPassword = '';
    rePassword = '';

    user: any;

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public loadingCtrl: LoadingController,
        private formBuilder: FormBuilder,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController
    ) {
        this.user = firebase.auth().currentUser;
        firebase.database().ref('user/' + this.user.uid).once('value', snapshot => {
            const userData = snapshot.val();
            this.fullname = userData.name;
            this.address = userData.address;
            this.email = userData.email;
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
                // Validators.required
            ])],
            'new-password': [null, Validators.compose([
                // Validators.required
            ])],
            're-password': [null, Validators.compose([
                // Validators.required
            ])]
        });
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }

    back() {
        this.navCtrl.navigateRoot('/officer-ministry');
    }

    updateProfile() {
        let updateUser = {};
        if (!this.user.email.includes(this.email)) { // อัพเดตอีเมล
            console.log('update email');
            if (this.password === '') {
                this.showToast('กรุณากรอกรหัสผ่าน หากต้องการเปลี่ยนอีเมล');
            } else {
                if (this.newPassword === '') {
                    const credentials = firebase.auth.EmailAuthProvider.credential(this.user.email, this.password);
                    this.user.reauthenticateWithCredential(credentials)
                        .then(value => {
                            this.user.updateEmail(this.email).then(isUpdate => {
                                updateUser = {
                                    uid: this.user.uid,
                                    name: this.fullname,
                                    address: this.address,
                                    email: this.email
                                };
                                firebase.database().ref('update/' + this.user.uid).update(updateUser);
                                this.showToast('ขอบคุณสำหรับข้อมูล\nเจ้าหน้าที่ทำการตรวจสอบ');
                            });
                        });
                } else {
                    if (this.newPassword === this.rePassword) {
                        const credentials = firebase.auth.EmailAuthProvider.credential(this.user.email, this.password);
                        this.user.reauthenticateWithCredential(credentials)
                            .then(value => {
                                this.user.updatePassword(this.newPassword).then(isPasswordUpdate => {
                                    this.user.updateEmail(this.email).then(isUpdate => {
                                        updateUser = {
                                            uid: this.user.uid,
                                            name: this.fullname,
                                            address: this.address,
                                            email: this.email
                                        };
                                        firebase.database().ref('update/' + this.user.uid).update(updateUser);
                                        this.showToast('ขอบคุณสำหรับข้อมูล\nเจ้าหน้าที่ทำการตรวจสอบ');
                                    });
                                });
                            });
                    } else {
                        this.showToast('กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน');
                    }
                }
            }
        } else {
            if (this.newPassword === '' || this.newPassword === null) {
                console.log('update data');
                updateUser = {
                    uid: this.user.uid,
                    name: this.fullname,
                    address: this.address
                };
                firebase.database().ref('update/' + this.user.uid).update(updateUser);
                this.showToast('ขอบคุณสำหรับข้อมูล\nเจ้าหน้าที่ทำการตรวจสอบ');
            } else {
                console.log('update password');
                if ((this.newPassword === this.rePassword) && this.newPassword !== '') {
                    const credentials = firebase.auth.EmailAuthProvider.credential(this.email, this.password);
                    this.user.reauthenticateWithCredential(credentials)
                        .then(value => {
                            this.user.updatePassword(this.newPassword).then(isPasswordUpdate => {
                                updateUser = {
                                    uid: this.user.uid,
                                    name: this.fullname,
                                    address: this.address
                                };
                                firebase.database().ref('update/' + this.user.uid).update(updateUser);
                                this.showToast('ขอบคุณสำหรับข้อมูล\nเจ้าหน้าที่ทำการตรวจสอบ');
                            });
                        });
                } else {
                    this.showToast('กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน');
                }
            }
        }
    }
}

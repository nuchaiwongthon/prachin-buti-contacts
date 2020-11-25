import {Component, OnInit} from '@angular/core';
import {AlertController, MenuController, ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {LaunchNavigator} from '@ionic-native/launch-navigator/ngx';
import * as firebase from 'Firebase';
import {snapshotToArray} from '../admin-ministry/adm-ministry.page';

@Component({
    selector: 'app-officer-phone',
    templateUrl: './officer-phone.page.html',
    styleUrls: ['./officer-phone.page.scss'],
})
export class OfficerPhonePage implements OnInit {

    notificationCount: number;
    notificationList = [];

    ministryList = [];
    officerList = [];
    favoriteList = [];

    searchTel = '';
    searchFax = '';

    user: any;

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public popoverCtrl: PopoverController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        private callNumber: CallNumber,
        private launchNavigator: LaunchNavigator
    ) {
        this.user = firebase.auth().currentUser;
        firebase.database().ref('officer/').on('child_added', data => {
            this.notificationCount++;
            this.notificationList.push(data.val());
        });
        firebase.database().ref('ministry/').on('value', data => {
            this.ministryList = [];
            this.ministryList = snapshotToArray(data);
        });
        this.getOfficers('', '');
    }

    ngOnInit() {
    }

    eventSearchTel(event: any) {
        const val = event.target.value;
        this.getOfficers(val.toString(), '');
    }

    eventSearchFax(event: any) {
        const val = event.target.value;
        this.getOfficers('', val.toString());
    }

    getOfficers(search: string, position: string) {
        firebase.database().ref('favorite/' + this.user.uid + '/').on('value', data => {
            this.favoriteList = [];
            data.forEach(dataSnapshot => {
                const favItem = dataSnapshot.val();
                this.favoriteList.push(favItem);
            });
            firebase.database().ref('officer/').on('value', snapshot => {
                this.officerList = [];
                snapshot.forEach(snapshotData => {
                    const item = snapshotData.val();
                    item.uid = snapshotData.key;
                    item.favorite = false;
                    this.favoriteList.forEach(favorite => {
                        if (favorite.uid === snapshotData.key) {
                            item.favorite = true;
                        }
                    });
                    if (item.tel.includes(search) && item.fax.includes(position)) {
                        this.officerList.push(item);
                    }
                });
            });
        });
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    async showNotification() {
        const notificationData = [];
        let itemCount = 1;
        if (this.notificationCount > 0) {
            this.notificationList.forEach(officer => {
                const officerName = '' + itemCount + '. ' + officer.position + ' ' + officer.name + ' (กระทรวง' + officer.ministry + ')';
                notificationData.push({
                    value: officerName,
                    disabled: true
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
                        }
                    }
                ]
            });
            alert.present();
        }
    }

    actionCall(tel: string) {
        this.callNumber.callNumber(tel, true);
    }

    actionMap(lat: string, lng: string) {
        const destination = [Number(lat), Number(lng)];
        this.launchNavigator.navigate(destination);
    }

    actionFavorite(officer: any) {
        let favoriteAlready = false;
        this.favoriteList.forEach(fav => {
            console.log('Officer uid: ' + fav.uid);
            console.log('Fav uid: ' + officer.uid);
            if (officer.uid === fav.uid) {
                favoriteAlready = true;
            }
        });
        if (favoriteAlready) {
            firebase.database()
                .ref('favorite/' + this.user.uid + '/' + officer.uid)
                .remove()
                .then(value => {
                    this.getOfficers('', '');
                });
        } else {
            firebase.database()
                .ref('favorite/' + this.user.uid + '/' + officer.uid)
                .set(officer)
                .then(value => {
                    this.getOfficers('', '');
                });
        }
    }
}

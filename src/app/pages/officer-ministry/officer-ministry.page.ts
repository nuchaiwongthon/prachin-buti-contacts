import {Component, OnInit} from '@angular/core';
import {AlertController, MenuController, ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import * as firebase from 'Firebase';
import {snapshotToArray} from '../admin-ministry/adm-ministry.page';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {LaunchNavigator} from '@ionic-native/launch-navigator/ngx';

@Component({
    selector: 'app-officer-ministry',
    templateUrl: './officer-ministry.page.html',
    styleUrls: ['./officer-ministry.page.scss'],
})
export class OfficerMinistryPage implements OnInit {

    notificationCount = 0;
    notificationShow = 0;
    notificationList = [];

    ministryList = [];
    officerList = [];
    favoriteList = [];

    searchName = '';

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
        firebase.database().ref('officer/').once('value', data => {
            data.forEach(snapshot => {
                this.notificationCount++;
            });
        });
        firebase.database().ref('ministry/').on('value', data => {
            this.ministryList = [];
            this.ministryList = snapshotToArray(data);
        });
        this.getOfficers('');
    }

    searchData(event: any) {
        const val = event.target.value;
        this.getOfficers(val.toString());
    }

    getOfficers(search: string) {
        firebase.database().ref('favorite/' + this.user.uid + '/').on('value', data => {
            this.favoriteList = [];
            data.forEach(dataSnapshot => {
                const favItem = dataSnapshot.val();
                this.favoriteList.push(favItem);
            });
            firebase.database().ref('officer/').on('value', snapshot => {
                this.officerList = [];
                let count = 1;
                snapshot.forEach(snapshotData => {
                    const item = snapshotData.val();
                    item.uid = snapshotData.key;
                    item.favorite = false;
                    this.favoriteList.forEach(favorite => {
                        if (favorite.uid === snapshotData.key) {
                            item.favorite = true;
                        }
                    });
                    if (item.ministry.includes(search)) {
                        this.officerList.push(item);
                    }
                    console.log('Count: ' + count + ' , Notification Length: ' + this.notificationList.length);
                    if (count > this.notificationCount) {
                        this.notificationShow = count - this.notificationCount;
                        // this.notificationCount++;
                        this.notificationList.push(item);

                        console.log('Notification Show: ' + this.notificationShow);
                        console.log('Notification Count: ' + this.notificationCount);
                    }
                    count++;
                });
            });
        });
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    async showNotification() {
        const notificationData = [];
        let itemCount = 1;
        if (this.notificationShow > 0) {
            this.notificationList.forEach(officer => {
                const officerName = '' + itemCount + '. ' + officer.position + ' ' + officer.name + ' (กระทรวง' + officer.ministry + ')';
                notificationData.push({
                    value: officerName,
                    disabled: true
                });
                itemCount++;
            });
            // this.notificationCount = 0;
            // this.notificationList = [];
            const alert = await this.alertCtrl.create({
                header: 'แจ้งเตือนอัพเดตข้อมูลราชการ',
                message: 'มีข้อมูลราชการอัพเดตเพิ่ม ' + this.notificationShow + ' รายการ',
                inputs: notificationData,
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'ปิด',
                        role: 'cancel',
                        handler: () => {
                            this.notificationCount += this.notificationShow;
                            this.notificationShow = 0;
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
                    this.getOfficers('');
                });
        } else {
            firebase.database()
                .ref('favorite/' + this.user.uid + '/' + officer.uid)
                .set(officer)
                .then(value => {
                    this.getOfficers('');
                });
        }
    }
}

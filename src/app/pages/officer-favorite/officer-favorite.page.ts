import {Component, OnInit} from '@angular/core';
import {AlertController, MenuController, ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {LaunchNavigator} from '@ionic-native/launch-navigator/ngx';
import * as firebase from 'Firebase';

@Component({
    selector: 'app-officer-favorite',
    templateUrl: './officer-favorite.page.html',
    styleUrls: ['./officer-favorite.page.scss'],
})
export class OfficerFavoritePage implements OnInit {

    notificationCount = 0;
    notificationShow = 0;
    notificationList = [];

    officerList = [];
    favoriteList = [];

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
        this.getOfficers('');
    }

    getOfficers(search: string) {
        firebase.database().ref('favorite/' + this.user.uid + '/').on('value', data => {
            this.officerList = [];
            data.forEach(dataSnapshot => {
                const favItem = dataSnapshot.val();
                // this.favoriteList.push(favItem);
                favItem.favorite = true;
                this.officerList.push(favItem);
            });
            firebase.database().ref('officer/').on('value', snapshot => {
                let count = 1;
                snapshot.forEach(snapshotData => {
                    const item = snapshotData.val();
                    console.log('Count: ' + count + ' , Notification Length: ' + this.notificationList.length);
                    if (count > this.notificationCount) {
                        this.notificationShow = count - this.notificationCount;
                        this.notificationCount++;
                        this.notificationList.push(item);
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
        firebase.database()
            .ref('favorite/' + this.user.uid + '/' + officer.uid)
            .remove()
            .then(value => {
                this.getOfficers('');
            });
    }
}

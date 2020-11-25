import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public appPages: Array<Pages>;

  name: any;
  email: any;

  position: any;

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, public navCtrl: NavController) {
    this.initializeApp();

    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        if (user.email === 'admin@gmail.com') {
          this.name = 'Admin';
          this.email = user.email;
          this.appPages = [
            {
              title: 'คำขออนุมัติขอเป็นสมาชิกราชการ',
              url: '/admin-check-user',
              direct: 'root',
              icon: 'people',
            },
            {
              title: 'คำขออนุมัติแก้ไขข้อมูลสมาชิก',
              url: '/admin-check-edit',
              direct: 'forward',
              icon: 'checkmark',
            },

            {
              title: 'จัดการข้อมูลกระทรวง',
              url: '/admin-ministry',
              direct: 'forward',
              icon: 'cog',
            },

            {
              title: 'จัดการตำแหน่งงาน',
              url: '/admin-position',
              direct: 'forward',
              icon: 'cog',
            },
          ];
        } else {
          const playersRef = firebase.database().ref('user/');
          playersRef
            .orderByChild('email')
            .equalTo(user.email)
            .on('child_added', (data) => {
              if (data.val().id_type === 'UT00003') {
                this.name = data.val().name;
                this.email = data.val().email;
                this.appPages = [
                  {
                    title: 'ค้นหาชื่อกระทรวง/สังกัด',
                    url: '/officer-ministry',
                    direct: 'root',
                    icon: 'search',
                  },
                  {
                    title: 'ค้นหารายชื่อ/ตำแหน่ง',
                    url: '/officer-position',
                    direct: 'forward',
                    icon: 'search',
                  },
                  {
                    title: 'ค้นหาจากหมายเลขโทรศัพท์มือถือ/สำนักงาน',
                    url: '/officer-phone',
                    direct: 'forward',
                    icon: 'search',
                  },
                  {
                    title: 'รายการโปรด',
                    url: '/officer-favorite',
                    direct: 'forward',
                    icon: 'heart',
                  },
                ];
              } else {
                // this.position = 1;
                this.name = data.val().name;
                this.email = data.val().email;
                this.appPages = [
                  {
                    title: 'ค้นหาชื่อกระทรวง/สังกัด',
                    url: '/officer-ministry',
                    direct: 'root',
                    icon: 'search',
                  },
                  {
                    title: 'ค้นหารายชื่อ/ตำแหน่ง',
                    url: '/officer-position',
                    direct: 'forward',
                    icon: 'search',
                  },
                  {
                    title: 'ค้นหาจากหมายเลขโทรศัพท์มือถือ/สำนักงาน',
                    url: '/officer-phone',
                    direct: 'forward',
                    icon: 'search',
                  },
                  {
                    title: 'บันทึกความทรงจำ',
                    url: '/officer-note',
                    direct: 'forward',
                    icon: 'paper',
                  },
                  {
                    title: 'รายการโปรด',
                    url: '/officer-favorite',
                    direct: 'forward',
                    icon: 'heart',
                  },
                ];
              }
            });
          // firebase
          //   .database()
          //   .ref('user/' + user.uid)
          //   .on('value', (snapshot) => {
          //     const userData = snapshot.val();
          //     console.log(userData);

          // }
          // });
        }
      }
    });
    // const user = firebase.auth().currentUser;
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      })
      .catch(() => {});
    firebase.initializeApp(environment.firebase);
  }

  goToEditProfile() {
    if (this.position === 9) {
      this.navCtrl.navigateForward('admin-edit-profile');
    } else if (this.position === 1) {
      this.navCtrl.navigateForward('user-edit-profile');
    } else {
      this.navCtrl.navigateForward('user-edit-profile');
    }
  }

  logout() {
    firebase.auth().signOut();
    this.navCtrl.navigateRoot('/');
  }
}

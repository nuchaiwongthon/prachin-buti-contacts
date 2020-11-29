import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {}

  ngOnInit() {}

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000,
    });

    loader.present();
    loader.onWillDismiss().then(async (l) => {
      const toast = await this.toastCtrl.create({
        message: 'บันทึกข้อมูลแล้ว',
        duration: 3000,
      });

      toast.present();
      this.navCtrl.navigateForward('/admin-check-user');
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-select-register',
  templateUrl: './select-register.page.html',
  styleUrls: ['./select-register.page.scss'],
})
export class SelectRegisterPage implements OnInit {

  constructor(
      public navCtrl: NavController) { }

  ngOnInit() {
  }

  goToHome() {
    this.navCtrl.navigateRoot('/');
  }

  goToCustomerRegister() {
    this.navCtrl.navigateRoot('/customer-register');
  }

  goToOfficerRegister() {
    this.navCtrl.navigateRoot('/officer-register');
  }
}

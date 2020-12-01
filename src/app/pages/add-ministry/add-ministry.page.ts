import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'Firebase';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-add-ministry',
  templateUrl: './add-ministry.page.html',
  styleUrls: ['./add-ministry.page.scss'],
})
export class AddMinistryPage implements OnInit {
  public onAddMinisterForm: FormGroup;
  ref = firebase.database().ref('ministry/');

  name: string;

  ministry: any;
  isUpdate = false;
  titleName = 'เพิ่มข้อมูลกระทรวง';
  dataRun: any = 0;
  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.ministry = this.router.getCurrentNavigation().extras.state.ministry;
        this.name = this.ministry.name_min;

        this.isUpdate = true;
        this.titleName = 'แก้ไขข้อมูลกระทรวง';
      }
    });
  }

  ngOnInit() {
    this.onAddMinisterForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
    });
  }

  async addMinistry() {
    let dataSet = [];
    await firebase
      .database()
      .ref(`ministry/`)
      .on(`value`, (resp) => {
        resp.forEach((snapshot) => {
          let item = snapshot.key;
          dataSet.push(Number(item.replace('M', '')));
        });
        let sort = dataSet.sort(function (a, b) {
          return b - a;
        });
        this.dataRun = sort[0];
      });
    if (this.isUpdate) {
      firebase
        .database()
        .ref('ministry/' + this.ministry.id)
        .update({ name_min: this.onAddMinisterForm.value.name });
      this.navCtrl.navigateBack('/admin-ministry');
    } else {
      this.ref.child(`M0000${Number(this.dataRun ? this.dataRun : 0) + 1}`).set({
        name_min: this.onAddMinisterForm.value.name,
      });
      this.navCtrl.navigateBack('/admin-ministry');
    }
  }

  back() {
    this.navCtrl.navigateBack('/admin-ministry');
  }
}

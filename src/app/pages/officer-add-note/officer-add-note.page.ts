import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'Firebase';
import { AlertController, MenuController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-officer-add-note',
  templateUrl: './officer-add-note.page.html',
  styleUrls: ['./officer-add-note.page.scss'],
})
export class OfficerAddNotePage implements OnInit {
  public onAddNoteForm: FormGroup;

  user: any;

  note: any;
  isUpdate = false;
  titleName = 'เพิ่มบันทึกความทรงจำ';

  title: string;
  detail: string;
  tel: string;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.user = firebase.auth().currentUser;
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.note = this.router.getCurrentNavigation().extras.state.note;
        this.title = this.note.title;
        this.detail = this.note.detail;
        this.tel = this.note.tel;

        this.isUpdate = true;
        this.titleName = 'แก้ไขบันทึกความทรงจำ';
      }
    });
  }

  ngOnInit() {
    this.onAddNoteForm = this.formBuilder.group({
      title: [null, Validators.compose([Validators.required])],
      detail: [null, Validators.compose([Validators.required])],
      tel: [null, Validators.compose([Validators.required])],
    });
  }

  async addNote() {
    if (this.isUpdate) {
      firebase
        .database()
        .ref('note/' + this.note.id_note)
        .update({
          title: this.onAddNoteForm.value.title,
          detail: this.onAddNoteForm.value.detail,
          tel: this.onAddNoteForm.value.tel,
        });
      this.navCtrl.navigateBack('/officer-note');
    } else {
      const id = (await this.getLastRecordNote()) ? await this.getLastRecordNote() : 0;
      firebase
        .database()
        .ref(`note/`)
        .child(`N0000${Number(id) + 1}`)
        .set({
          title: this.onAddNoteForm.value.title,
          id_user: localStorage.getItem('user'),
          detail: this.onAddNoteForm.value.detail,
          tel: this.onAddNoteForm.value.tel,
        });
      this.navCtrl.navigateBack('/officer-note');
    }
  }

  back() {
    this.navCtrl.navigateBack('/officer-note');
  }
  getLastRecordNote() {
    return new Promise(async (resolve, reject) => {
      let dataSet = [];
      await firebase
        .database()
        .ref(`note/`)
        .on(`value`, (resp) => {
          resp.forEach((snapshot) => {
            let item = snapshot.key;
            dataSet.push(Number(item.replace('N', '')));
          });
          let sort = dataSet.sort(function (a, b) {
            return b - a;
          });
          resolve(sort[0]);
        });
    });
  }
}

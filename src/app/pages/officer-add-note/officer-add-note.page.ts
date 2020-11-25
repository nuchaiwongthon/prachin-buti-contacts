import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'Firebase';
import {
    AlertController,
    MenuController,
    ModalController,
    NavController,
    PopoverController,
    ToastController
} from '@ionic/angular';

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

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public popoverCtrl: PopoverController,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.user = firebase.auth().currentUser;
        this.route.queryParams.subscribe(params => {
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
            'title': [null, Validators.compose([
                Validators.required
            ])],
            'detail': [null, Validators.compose([
                Validators.required
            ])],
            'tel': [null, Validators.compose([
                Validators.required
            ])]
        });
    }

    addNote() {
        if (this.isUpdate) {
            firebase.database().ref('note/' + this.user.uid + '/' + this.note.uid)
                .update(this.onAddNoteForm.value);
            this.navCtrl.navigateBack('/officer-note');
        } else {
            const newNote = firebase.database().ref('note/' + this.user.uid).push();
            newNote.set(this.onAddNoteForm.value);
            this.navCtrl.navigateBack('/officer-note');
        }
    }

    back() {
        this.navCtrl.navigateBack('/officer-note');
    }

}

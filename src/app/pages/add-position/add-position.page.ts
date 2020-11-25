import { Component, OnInit } from "@angular/core";
import {
  LoadingController,
  MenuController,
  NavController,
} from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as firebase from "Firebase";
import { snapshotToArray } from "../admin-ministry/adm-ministry.page";

@Component({
  selector: "app-add-position",
  templateUrl: "./add-position.page.html",
  styleUrls: ["./add-position.page.scss"],
})
export class AddPositionPage implements OnInit {
  ministryList = [];
  ref = firebase.database().ref("ministry/");
  refPosition = firebase.database().ref("officer/");

  public onAddPositionForm: FormGroup;

  officer: any;
  titleName = "เพิ่มข้อมูลตำแหน่งงาน";
  isUpdate = false;

  ministry: string;
  position: string;
  name: string;
  tel: string;
  fax: string;
  address: string;
  lat: string;
  lng: string;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ref.on("value", (resp) => {
      this.ministryList = [];
      this.ministryList = snapshotToArray(resp);
    });

    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.officer = this.router.getCurrentNavigation().extras.state.officer;
        console.log("====================================");
        console.log(this.officer);
        console.log("====================================");
        this.ministry = this.officer.ministry;
        this.position = this.officer.position;
        this.name = this.officer.name;
        this.tel = this.officer.tel;
        this.fax = this.officer.fax;
        this.address = this.officer.address;
        this.lat = this.officer.lat;
        this.lng = this.officer.lng;

        this.isUpdate = true;
        this.titleName = "แก้ไขข้อมูลตำแหน่งงาน";
      }
    });
  }

  ngOnInit() {
    this.onAddPositionForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      position: [null, Validators.compose([Validators.required])],
      tel: [null, Validators.compose([Validators.required])],
      fax: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required])],
      lat: [null, Validators.compose([Validators.required])],
      lng: [null, Validators.compose([Validators.required])],
      ministry: [null, Validators.compose([Validators.required])],
    });
  }

  addPosition() {
    if (this.isUpdate) {
      firebase
        .database()
        .ref("officer/" + this.officer.uid)
        .update(this.onAddPositionForm.value);
      this.navCtrl.navigateBack("/admin-position");
    } else {
      const newPosition = this.refPosition.push();
      newPosition.set(this.onAddPositionForm.value);
      this.navCtrl.navigateBack("/admin-position");
    }
  }

  back() {
    this.navCtrl.navigateBack("/admin-position");
  }
}

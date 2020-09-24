import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams}  from '@ionic/angular';

@Component({
  selector: 'app-pickupmodal',
  templateUrl: './pickupmodal.page.html',
  styleUrls: ['./pickupmodal.page.scss'],
})
export class PickupmodalPage implements OnInit {

  time : boolean;
  mode : boolean;
  pick : boolean = false;
  delivery : boolean = true;
  pickupAvailable : boolean;
  pickupHours: any;
  pickupStart:any;
  pickupEnd:any;
  now: any;
  days= ["monday","tuesday","wednesday","thursday", "friday", "saturday", "sunday"];
  constructor(private modalCntrl : ModalController, private navParams : NavParams) { }

  ngOnInit() {
    this.pickupAvailable = this.navParams.data.pickupAvailable;
    this.time = true;
    this.mode = true;
    
  }

  today() {
    var d = new Date();
    var n = d.getDay();
    var h = d.getHours();
    var m = d.getMinutes();
    var time = String(h)+':'+String(m)
    var today = {'day': n, 'time': time}
    return today;
  }

  changeTime(value : boolean) {
    this.time = value;
  }

  segmentChanged(ev: any) {
    console.log("segment changed")
    console.log(ev)
    this.mode = ev.detail.value;
  }

  async onSubmit() {
    console.log("pickupsMOdal mode after onsubmit")
    console.log(this.mode)
    const data = {mode : this.mode,time : this.time}
    await this.modalCntrl.dismiss(data);
  }
 
}

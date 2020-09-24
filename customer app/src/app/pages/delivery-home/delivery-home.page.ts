import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GoogleMapService } from '../../services/google-map.service';
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-delivery-home',
  templateUrl: './delivery-home.page.html',
  styleUrls: ['./delivery-home.page.scss'],
})
export class DeliveryHomePage implements OnInit {
  isAnonymous: string ;
  name : string;
  address : string ;
  email: string;
  phone: any;
  totalPrice : any;
  resAdress : any;
  homeDeliviry : any;
  mode : any ;
  deliverTime : any;
  delivryTime : any;
  hours : any;
  min : any;
  homePrice : any;
  distance : any;
  change : any;
  currency : any;
  constructor(public platform : Platform,
              private navCntrl : NavController,
              private router : ActivatedRoute,
              private googleMaps : GoogleMapService) { 
                this.delivryTime = new Date().toISOString();
              }

  ngOnInit() {
    this.getDataFromCarte();
    this.currency = localStorage.getItem("selectedCountry") == "IE" ? "€" : "£";

  }

  back() : void {
    this.navCntrl.back();
  }

  getDataFromCarte() {
    console.log("get data from cart routerrrrrr")
    console.log(this)
    this.totalPrice = Number(this.router.snapshot.paramMap.get('totalPrice'));
    this.resAdress = this.router.snapshot.paramMap.get('resAddress');
    this.homeDeliviry = this.router.snapshot.paramMap.get('duration');
    this.address = this.router.snapshot.paramMap.get('homeAddress');
    this.isAnonymous = localStorage.getItem('isAnonymous');
    this.deliverTime = this.router.snapshot.paramMap.get('time');
    this.mode = this.router.snapshot.paramMap.get('mode');
    this.min = this.router.snapshot.paramMap.get('min');
    this.hours = this.router.snapshot.paramMap.get('hours');
    this.homePrice = this.router.snapshot.paramMap.get('homeprice');
    this.distance = this.router.snapshot.paramMap.get('distnace');
    this.change = this.router.snapshot.paramMap.get('change');

  }

  calculateDistance() {
    this.googleMaps.calculateDistance(this.resAdress,this.address)
    .then(() => {
      let homeDeliviry = JSON.parse(localStorage.getItem("homeAddresse"));
      if (homeDeliviry != null) {
        let estimated = "";
        const days = Math.floor(homeDeliviry.duration / 86400);
        const hours = Math.floor(homeDeliviry.duration / 3600) % 24;
        let minutes = Math.floor(homeDeliviry.duration / 60) % 3600;
        this.distance = homeDeliviry.distance;
        this.address = homeDeliviry.address;
        if (minutes > 45) {
          minutes = 60;
        } else if (minutes > 30) {
          minutes = 45;
        } else if (minutes > 15) {
          minutes = 60;
        } else {
          minutes = 15;
        }
        if (days > 0) {
          estimated += days + " days ";
        }
  
        if (hours > 0) {
          estimated += hours + " hours ";
        }
  
        if (minutes > 0) {
          estimated += minutes + " min ";
        }
  
        this.homeDeliviry = estimated;
        this.CalculatePrice();
      }
    },err => {
      this.homeDeliviry = null;
    });
    
  }

  CalculatePrice() {
    this.totalPrice -= Number(this.homePrice);
    const fixedPriceForMeters = 0.00005;
    this.homePrice = (fixedPriceForMeters*this.distance).toFixed(2);
    this.totalPrice += Number(this.homePrice);
  }

  onSubmit()  {
    if( this.isAnonymous == "true"){
    console.log("is anonymous submitted")
    this.navCntrl.navigateBack(["tabs/tab3",{status : true,customer : JSON.stringify({isAnonymous:this.isAnonymous, name: this.name, email: this.email, address : this.address, phone: this.phone, time : this.delivryTime,mode : this.mode,homePrice : this.homePrice,estimated : this.homeDeliviry}) }]);
  }else{
    console.log("is not anonymous submitted")
      this.navCntrl.navigateBack(["tabs/tab3",{status : true,customer : JSON.stringify({address : this.address,time : this.delivryTime,mode : this.mode,homePrice : this.homePrice,estimated : this.homeDeliviry}) }]);
    }
  }

  onChange() {
    if( this.isAnonymous == "true")
    this.navCntrl.navigateBack(["tabs/tab3",{status : false,customer : JSON.stringify({name: this.name, email: this.email, address : this.address, phone: this.phone,time : this.delivryTime,mode : this.mode,homePrice : this.homePrice,estimated : this.homeDeliviry}) }]);
    else
    this.navCntrl.navigateBack(["tabs/tab3",{status : false,customer : JSON.stringify({address : this.address,time : this.delivryTime,mode : this.mode,homePrice : this.homePrice,estimated : this.homeDeliviry}) }]);
  }

}
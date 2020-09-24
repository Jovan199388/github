import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ApisService } from "src/app/services/apis.service";
import { UtilService } from "src/app/services/util.service";
import { Router, NavigationExtras,ActivatedRoute } from "@angular/router";
import { NavController,ModalController,AlertController } from "@ionic/angular";
import * as moment from "moment";
import { DeliveryHomePage } from "../delivery-home/delivery-home.page";
import { GoogleMapService } from "../../services/google-map.service";
import { PickupmodalPage } from '../pickupmodal/pickupmodal.page';
import { OptionsPage } from '../options/options.page';

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  drinkFoods : any[] = [];

  haveItems: boolean = false;
  vid: any = "";
  foods: any;
  name: any;
  descritions: any;
  cover: any;
  address: any;
  time: any;
  totalPrice: any = 0;
  totalItem: any = 0;
  totalAddons: any =0;
  serviceTax: any = 0;
  deliveryCharge: any = 5;
  grandTotal: any = 0;
  serviceCharge: any = 0;
  serviceChargeRate: any = 0;
  deliveryAddress: any = "";
  totalRatting: any = 0;
  coupon: any;
  dicount: any;
  notes: string = "";
  tableNo: string = "";
  currency: any = "";
  minimumOrder: number;
  venue: any;
  listCoupons: any[] = [];
  dummyCoupon = Array(10);
  findedList: any;

  list: any[] = [];
  restId: any;
  total: any;
  dummy = Array(10);
  couponCode: string;
  displaySegment: boolean = true;
  delivryTime: any;
  open: any;
  close: any;
  min: any;
  hours: any;
  homeDeliviry: any;
  mode : boolean = true;
  delivertime : boolean = true;
  homeprice : any = 0;
  customer : any;
  extras : any[] = [];
  catDrinkid : any;
  addons : any[] = [];
  sizes : any[] = [];
  pickupAvailable : boolean;
  pickupHours: any;
  pickupStart:any;
  pickupEnd:any;
  now: any;
  days= ["monday","tuesday","wednesday","thursday", "friday", "saturday", "sunday"];
  constructor(
    private api: ApisService,
    private router: Router,
    private util: UtilService,
    private navCtrl: NavController,
    private chMod: ChangeDetectorRef,
    private googleMapService: GoogleMapService,
    private modalCntrl : ModalController,
    private activatedRouter : ActivatedRoute,
    private alertCntrl : AlertController
  ) {
    this.util.getCouponObservable().subscribe((data) => {
      if (data) {
        console.log(data);
        this.coupon = data;
        console.log("coupon", this.coupon);
        console.log(this.totalPrice);
        localStorage.setItem("coupon", JSON.stringify(data));
        this.calculate();
      }
    });
    this.getOffers();
    this.getCoupons();
    this.min = new Date().toISOString();
  }

  ngOnInit() {
  
    this.currency = localStorage.getItem("selectedCountry") == "IE" ? "€" : "£";
    this.CalculateDistance();
    this.drinkFoods = JSON.parse(localStorage.getItem("drinkFoods"));
    this.addons = JSON.parse(localStorage.getItem("Addons"));
    if (this.activatedRouter.snapshot.paramMap.get('status') == "false"){
      this.customer = JSON.parse(this.activatedRouter.snapshot.paramMap.get('customer'));
      console.log("customer")
      console.log(this.customer)
    }
    else if (this.activatedRouter.snapshot.paramMap.get('status') == "true"){
      this.customer = JSON.parse(this.activatedRouter.snapshot.paramMap.get('customer'));
      this.navCtrl.navigateForward(["/payments",this.customer]);
      console.log("customer")
      console.log(this.customer)
    }
  }

  getCoupons() {
    this.api
      .getOffers()
      .then((data) => {
        this.dummyCoupon = [];
        console.log("list=====>", data);
        this.listCoupons = [];
        if (data && data.length) {
          const currnetDate = moment().format("YYYY-MM-DD");
          data.forEach((element) => {
            console.log(moment(element.expire).isAfter(currnetDate));
            if (
              element &&
              element.status === "active" &&
              moment(element.expire).isAfter(currnetDate)
            ) {
              console.log("yes=>", element);
              this.listCoupons.push(element);
            }
          });
        }
      })
      .catch((error) => {
        this.dummyCoupon = [];
        console.log(error);
      });
  }
  
  getAddress() {
    const add = JSON.parse(localStorage.getItem("deliveryAddress"));
    if (add && add.address) {
      this.deliveryAddress = add.address;
    }
    return this.deliveryAddress;
  }
  getVenueDetails() {
    // Venue Details
    this.api
      .getVenueDetails(this.vid)
      .then(
        (data) => {
          console.log(data);
          if (data) {
            this.venue = data;
            this.name = data.name;
            this.descritions = data.descritions;
            this.cover = data.cover;
            this.address = data.address;
            this.time = data.time;
            this.totalRatting = data.totalRatting;
            this.minimumOrder = data.minimumOrder;
            this.open = data.openTime;
            this.close = data.closeTime;

            this.min = this.min.split("T")[0] + "T" + this.open + "Z";
            console.log(this.min);
            let lenght =
              Number(this.close.split(":")[0]) -
              Number(this.open.split(":")[0]) +
              1;
            this.hours = Array.from(
              new Array(lenght),
              (x, i) => i + Number(this.open.split(":")[0])
            );
            console.log(this.hours);
          }
        },
        (error) => {
          console.log(error);
          this.util.errorToast(this.util.translate("Something went wrong"));
        }
      )
      .catch((error) => {
        console.log(error);
        this.util.errorToast(this.util.translate("Something went wrong"));
      });
  }

  validate() {
    let notes = sessionStorage.getItem("notes");
    if (notes) {
      this.notes = notes;
    }

    let tableNo = sessionStorage.getItem("tableNo");
    if (tableNo) {
      this.tableNo = tableNo;
    }

    this.api
      .checkAuth()
      .then(async (user) => {
        if (user) {
          const id = await localStorage.getItem("vid");
          console.log("id", id);
          if (id) {
            this.vid = id;
            this.getVenueDetails();
            const foods = await localStorage.getItem("foods");
            if (foods) {
              this.foods = await JSON.parse(foods);
              let recheck = await this.foods.filter((x) => x.quantiy > 0);
              console.log("vid", this.vid);
              console.log("foods", this.foods);
              if (this.vid && this.foods && recheck.length > 0) {
                this.haveItems = true;
                this.calculate();
                this.chMod.detectChanges();
              }
            }
          } else {
            this.haveItems = false;
            this.chMod.detectChanges();
          }
          this.chMod.detectChanges();
          return true;
        } else {
          this.router.navigate(["login"]);
          /*const id = await localStorage.getItem("vid");
          console.log("id", id);
          if (id) {
            console.log("this vid")
            console.log(this.vid)
            this.vid = id;
            this.getVenueDetails();
            const foods = await localStorage.getItem("foods");
            if (foods) {
              this.foods = await JSON.parse(foods);
              let recheck = await this.foods.filter((x) => x.quantiy > 0);
              console.log("vid", this.vid);
              console.log("foods", this.foods);
              if (this.vid && this.foods && recheck.length > 0) {
                this.haveItems = true;
                this.calculate();
                this.chMod.detectChanges();
              }
            }
          } else {
            this.haveItems = false;
            this.chMod.detectChanges();
          }
          this.chMod.detectChanges();
          return true;*/
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ionViewWillEnter() {
    this.validate();
  }
  getCart() {
    this.navCtrl.navigateRoot(["tabs/tab1"]);
  }

  
  updateNotes(index) {
    localStorage.setItem("foods", JSON.stringify(this.foods));
  }

  addQ(index) {
    this.foods[index].quantiy = this.foods[index].quantiy + 1;
    localStorage.setItem("foods", JSON.stringify(this.foods));
    this.calculate();
  }
  removeQ(index) {
    if (this.foods[index].quantiy != 0) {
      this.foods[index].quantiy = this.foods[index].quantiy - 1;
    } else {
      this.foods[index].quantiy = 0;
    }
    localStorage.setItem("foods", JSON.stringify(this.foods));
    this.calculate();
  }

  async calculate() {
    console.log(this.foods);
    let item = this.foods.filter((x) => x.quantiy > 0);
    console.log(item);
    this.totalPrice = 0;
    this.totalItem = 0;
    
    await item.forEach((element) => {
  this.totalAddons = 0;
  element.addonsSelected.forEach(addon => {
    this.totalAddons = this.totalAddons + addon.price;
  });
  var x;
  if(element.sizesSelected)
  x = element.sizesSelected.price
  else
  x = 0
      this.totalItem = this.totalItem + element.quantiy;
      this.totalPrice =
        this.totalPrice + ( parseFloat(element.price) + parseFloat(this.totalAddons) + parseFloat(x)) * parseInt(element.quantiy);
    });
    this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
    console.log("total item", this.totalItem);
    console.log("=====>", this.totalPrice);
    const tax = (parseFloat(this.totalPrice) * 21) / 100;
    this.serviceTax = 0;
    console.log("tax->", this.serviceTax);
    this.deliveryCharge = this.homeprice;
    this.grandTotal =
      parseFloat(this.totalPrice) +
      parseFloat(this.serviceTax) +
      parseFloat(this.deliveryCharge);
    this.grandTotal = this.grandTotal.toFixed(2);
    if (this.coupon && this.coupon.code && this.totalPrice >= this.coupon.min) {
      if (this.coupon.type === "%") {
        console.log("per");
        function percentage(totalValue, partialValue) {
          return (100 * partialValue) / totalValue;
        }
        const totalPrice = percentage(
          parseFloat(this.totalPrice).toFixed(2),
          this.coupon.discout
        );
        console.log("============>>>>>>>>>>>>>>>", totalPrice);
        this.dicount = totalPrice.toFixed(2);
        this.totalPrice = parseFloat(this.totalPrice) - totalPrice;
        console.log("------------>>>>", this.totalPrice);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
        const tax = (parseFloat(this.totalPrice) * 21) / 100;
        this.serviceTax = 0;
        console.log("tax->", this.serviceTax);
        this.deliveryCharge = this.homeprice;
        this.grandTotal =
          parseFloat(this.totalPrice) +
          parseFloat(this.serviceTax) +
          parseFloat(this.deliveryCharge);
        this.grandTotal = this.grandTotal.toFixed(2);
      } else {
        console.log("$");
        console.log("per");
        const totalPrice = parseFloat(this.totalPrice) - this.coupon.discout;
        console.log("============>>>>>>>>>>>>>>>", totalPrice);
        this.dicount = this.coupon.discout;
        this.totalPrice = parseFloat(this.totalPrice) - totalPrice;
        console.log("------------>>>>", this.totalPrice);
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
        console.log("total item", this.totalItem);
        console.log("=====>", this.totalPrice);
        const tax = (parseFloat(this.totalPrice) * 21) / 100;
        this.serviceTax = 0;
        console.log("tax->", this.serviceTax);
        this.deliveryCharge = this.homeprice;
        this.grandTotal =
          parseFloat(this.totalPrice) +
          parseFloat(this.serviceTax) +
          parseFloat(this.deliveryCharge);
        this.grandTotal = this.grandTotal.toFixed(2);
      }
    } else {
      console.log("not satisfied");
      this.coupon = null;
      localStorage.removeItem("coupon");
    }
    console.log("grand totla", this.grandTotal);
    if (this.totalItem === 0) {
      const lng = localStorage.getItem("language");
      const selectedCity = localStorage.getItem("selectedCity");
      const selectedCountry = localStorage.getItem("selectedCountry");
      await localStorage.clear();
      localStorage.setItem("language", lng);
      localStorage.setItem("selectedCity", selectedCity);
      localStorage.setItem("selectedCountry", selectedCountry);
      this.totalItem = 0;
      this.totalPrice = 0;
      this.haveItems = false;
    }
  }

  changeAddress() {
    const navData: NavigationExtras = {
      queryParams: {
        from: "cart",
      },
    };
    this.router.navigate(["choose-address"], navData);
  }
  checkout() {
    /** 
    if (this.tableNo.trim() == "") {
      this.util.showToast("Please specify Table Number", "danger", "bottom");
      return false;
    }
    **/
   if ((this.mode && localStorage.getItem("homeAddresse") != null) || (this.mode == false && this.delivertime == true)){
    if (this.minimumOrder && this.minimumOrder > 0) {
      console.log(this.minimumOrder);
      console.log(this.grandTotal);
      if (this.grandTotal < this.minimumOrder) {
        this.util.showToast(
          "Minimum value should be € " + this.minimumOrder.toFixed(2),
          "danger",
          "bottom"
        );
        return false;
      }
    }

    // return false;

    sessionStorage.setItem("tableNo", this.tableNo);
    sessionStorage.setItem("notes", this.notes);

    const navData: NavigationExtras = {
      queryParams: {
        from: "cart",
      },
    };
    if (this.customer){
      this.router.navigate(["payments",this.customer]);
    }
    else {
      if(localStorage.getItem('isAnonymous')=="true")
      {this.openDeliveryHome(false);}
      else
      {this.router.navigate(["payments",{mode : this.mode,homePrice : this.grandTotal}]);}
    }
    // this.router.navigate(['choose-address'], navData);
  } else {
    this.openDeliveryHome(false);
  }
  }

  openCoupon() {
    const navData: NavigationExtras = {
      queryParams: {
        restId: this.vid,
        name: this.name,
        totalPrice: this.totalPrice,
      },
    };
    this.router.navigate(["coupons"], navData);
  }

  getOffers() {
    this.api
      .getOffers()
      .then((data) => {
        this.dummy = [];
        console.log("list=====>", data);
        this.list = [];
        if (data && data.length) {
          const currnetDate = moment().format("YYYY-MM-DD");
          data.forEach((element) => {
            console.log(moment(element.expire).isAfter(currnetDate));
            if (
              element &&
              element.status === "active" &&
              moment(element.expire).isAfter(currnetDate)
            ) {
              console.log("yes=>", element);
              this.list.push(element);
            }
          });
          // this.list = data;
        }
      })
      .catch((error) => {
        this.dummy = [];
        console.log(error);
      });
  }

  claim() {
    this.findedList = null;

    this.listCoupons.map((item) => {
      console.log(item);
      if (item.code === this.couponCode) {
        this.findedList = item;
      }
    });

    if (this.findedList) {
      if (
        this.findedList &&
        this.findedList.available &&
        this.findedList.available.length
      ) {
        const data = this.findedList.available.filter(
          (x) => x.id === this.restId
        );
        console.log(data);
        if (data && data.length) {
          if (this.total >= this.findedList.min) {
            console.log("ok");
            this.util.showToast(
              this.util.translate("Coupon Applied"),
              "success",
              "bottom"
            );
            this.util.publishCoupon(this.findedList);
            this.navCtrl.back();
          } else {
            this.util.errorToast(
              this.util.translate(
                "For claiming this coupon your order required minimum order  of €"
              ) + this.findedList.min
            );
          }
        } else {
          this.util.errorToast(
            this.util.translate("This coupon is not valid for ") + this.name
          );
        }
      } else {
        this.util.errorToast(
          this.util.translate("This coupon is not valid for ") + this.name
        );
      }
    } else {
      this.util.errorToast(this.util.translate("This coupon does not exist "));
    }
  }

  private calculateServiceCharge() {
    this.serviceCharge = (this.serviceChargeRate * this.grandTotal) / 100;
    this.grandTotal = +this.serviceCharge + +this.grandTotal;
  }

  switchSegment(order: boolean): void {
    this.displaySegment = order;
  }

  openDeliveryHome(change : boolean): void {
    this.navCtrl.navigateForward([
      "/delivery-home",
      {
        totalPrice: this.grandTotal,
        resAddress: this.address,
        duration: this.homeDeliviry.duration,
        homeAddress: this.homeDeliviry.address,
        time : this.delivertime,
        mode : this.mode,
        min : this.min,
        hours : this.hours,
        homeprice : this.homeprice,
        distance : this.homeDeliviry.distance,
        change : change
      },
    ]);
  }

  CalculatePrice() {
    const fixedPriceForMeters = 0.00005;
    this.homeprice = (fixedPriceForMeters*this.homeDeliviry.distance).toFixed(2);
  }
  CalculateDistance() {
    console.log("calculate distance/////////////////")
    this.homeDeliviry = JSON.parse(localStorage.getItem("homeAddresse"));
    if (this.homeDeliviry != null) {
      let estimated = "";
      const days = Math.floor(this.homeDeliviry.duration / 86400);
      const hours = Math.floor(this.homeDeliviry.duration / 3600) % 24;
      let minutes = Math.floor(this.homeDeliviry.duration / 60) % 3600;
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
      console.log("estimated");
      console.log(estimated);
      console.log("this.homeDeliviry.distance");
      console.log(this.homeDeliviry.distance);
      this.homeDeliviry.duration = estimated;
      this.CalculatePrice();
    }
    else {
      this.homeDeliviry = {address : '',distance : '',duration : ''};
    }
  }

  
  today() {
    var d = new Date();
    var n = d.getDay();
    var h = d.getHours();
    var m = d.getMinutes();
    var time = moment().format("HH:mm")
    var today = {'day': n, 'time': time}
    return today;
  }


  async callPickUpModal() {

    this.pickupHours = this.venue.pickupTime;
    this.now = this.today().day-1;
    this.pickupStart = this.pickupHours[this.now][this.days[this.now]].start;
    this.pickupEnd = this.pickupHours[this.now][this.days[this.now]].end;

    if(this.pickupStart < this.today().time && this.pickupEnd > this.today().time){
      this.pickupAvailable = true; }
      else{
      this.pickupAvailable = false;}
    const modal = await this.modalCntrl.create({
      component : PickupmodalPage,
      swipeToClose : false,
      cssClass : 'pickupHalfModal',
      componentProps : {
        "pickupAvailable" : this.pickupAvailable,
      }

    });

    modal.onDidDismiss()
      .then(data => {
        console.log("after submit")
        console.log(data.data.mode)
        this.delivertime = data.data.time == true ? true : false;
        this.mode = data.data.mode == true ? true : false;
        console.log("after after submit")
        console.log(data.data.mode)
        this.checkPickModalData();
      },err => {
        this.util.errorToast("An Error Occurred please Try Again !")
      })
    return await modal.present();
  }

  checkPickModalData(){
    /*if (this.mode == false && this.delivertime == true){
      if(localStorage.getItem('isAnonymous')=="true")
      {
        console.log("isAnonymous")
       // this.openDeliveryHome(false);
        console.log(this.mode)
        this.navCtrl.navigateBack(["tabs/tab3",{status : this.mode, mode : this.mode}]);
      }
      else{
       // this.checkout();
        this.navCtrl.navigateBack(["tabs/tab3",{status : this.mode, mode : this.mode}]);
      }
    }
    else {
      this.openDeliveryHome(true);
    }*/
    
    const navData: NavigationExtras = {
      queryParams: {
        status: this.mode,
        mode: this.mode,
      },
    };

    this.router.navigate(["tabs/tab3"], navData);
    //this.navCtrl.navigateForward(["tabs/tab3",{status : this.mode, mode : this.mode}]);
  }

  async createModal(index,catename, food)  {
    let meal : boolean;
    if (catename === "OaqklHOT2m"){
      meal = true;
    }
    else {
      meal = false;
    }
    const modal = await this.modalCntrl.create({
      component : OptionsPage,
      componentProps : {
        "meal" : meal,
        "drinks" : this.drinkFoods,
        "addons" : food.addons,
        "sizes" : food.sizes
      }
    });

    modal.onDidDismiss()
          .then(data => {
            if (data.data != null){
              this.extras.push(Number(data.data.size.extra));
              this.getSelectedFoodIndex(data.data.drinks);
              this.getSelectedFoodIndex(data.data.addons);
              this.foods[index].quantiy = this.foods[index].quantiy + 1;
              this.calculate();
              console.log(data.data.size);
            }
          },
          err => {
            console.log(err);
          });
    return await modal.present();
  }


  checkTime() : boolean {
    let now: string;
    now = new Date().toString().split(' ')[4];
    let hours = now.split(':')[0];
    let minutes = now.split(':')[1];
    now = "11:00";
    if (now < this.close && now > this.open){
      return true;
    }
    else  {
      return false;
    }
  }

  getSelectedFoodIndex(selectedDrinks : []) {
    selectedDrinks.forEach(drink => {
      const i = this.foods.indexOf(drink);
      console.log("selected",i);
      if (i == -1){
        this.foods.push(drink);
      }
      this.addQ(this.foods.indexOf(drink));
    });
  }

  add(index,catename) {
    if (this.checkTime()){
    this.api
      .checkAuth()
      .then(() => {
        this.addQ(index);
          //this.createModal(index,catename, this.foods[index]);
          //console.log(this.foods[index]);
          
        
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      this.util.errorToast("The restaurant is open from "+ this.open + " to " + this.close);
    }

  }

  
}


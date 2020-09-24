import { Component, OnInit } from '@angular/core';
import {ModalController,NavParams}  from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  drinks : [];
  selectedDrinks : any[] = [];
  Size : any ;
  currency : any ;
  sizes : any[] = [];
  ismeal : boolean;
  addons : any[] = [];
  selectedAddons : any[] = [];

  constructor(private modalCntrl : ModalController,
              private navParams : NavParams,
              public platform : Platform) { 
  }

  ngOnInit() {
    console.log("this")
    console.log(this)
    this.ismeal = this.navParams.data.meal;
    this.drinks = this.navParams.data.drinks;
    this.addons = this.navParams.data.addons;
    this.sizes = this.navParams.data.sizes;
    this.currency = this.navParams.data.currency;
    console.log("this.navParams.data.sizes")
    console.log(this.navParams.data.sizes)
  }

  async dissMiss() {
    await this.modalCntrl.dismiss(null);
  };

  checkedSize(selectedSize) : void {
    console.log(this.sizes);
    this.Size = {price : selectedSize.price,name : selectedSize.name };
    this.sizes.forEach(size => {
      if (size.price != selectedSize.price && size.isChecked == true ){
          size.isChecked = false;
          console.log(this.sizes);
      }
    });
  }

  async onSubmit()  {
    const data = {size : this.Size , drinks : this.selectedDrinks,addons : this.selectedAddons, quantiy: 1}
    await this.modalCntrl.dismiss(data);
  }

  add(item) {
    const i = this.selectedDrinks.indexOf(item);
    if (i == -1){
      this.selectedDrinks.push(item);
    }
    else {
      this.selectedDrinks.splice(i,1);
    }

    console.log(this.selectedDrinks);
  }
  
  adda(addon) {
    const i = this.selectedAddons.indexOf(addon);
    if (i == -1){
      this.selectedAddons.push(addon);
    }
    else {
      this.selectedAddons.splice(i,1);
    }
  }

}

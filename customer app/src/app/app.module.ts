import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { AgmCoreModule} from '@agm/core';
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AdMobFree } from "@ionic-native/admob-free/ngx";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";

import { environment } from "src/environments/environment";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ChooseAddressPageModule } from "src/app/pages/choose-address/choose-address.module";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { Camera } from "@ionic-native/camera/ngx";
import { PayPal } from "@ionic-native/paypal/ngx";

import { SelectDriversPageModule } from "./pages/select-drivers/select-drivers.module";
import { VariationPageModule } from "./pages/variation/variation.module";
import { NgPipesModule } from "ngx-pipes";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

import {googleMapApi} from '../environments/environment.prod';
import { NgxIonicImageViewerModule } from "ngx-ionic-image-viewer";
import {GoogleMapService} from "./services/google-map.service";
import { PickupmodalPageModule } from './pages/pickupmodal/pickupmodal.module'
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { PickupmodalPage } from './pages/pickupmodal/pickupmodal.page';
export function customTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ChooseAddressPageModule,
    HttpClientModule,
    SelectDriversPageModule,
    VariationPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: customTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgPipesModule,
    NgxIonicImageViewerModule,
    AgmCoreModule.forRoot({
      apiKey : "AIzaSyDraNOYxpwzp1K8MKF35l47P5ikCrFqraI",
      libraries: ['geometry']
    }
    ),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    AndroidPermissions,
    Diagnostic,
    Geolocation,
    OneSignal,
    Camera,
    PayPal,
    AdMobFree,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GoogleMapService,
    NativeGeocoder,
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

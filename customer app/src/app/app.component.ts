import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { environment } from "src/environments/environment";
import { TranslateService } from "@ngx-translate/core";
import { GoogleMapService} from "./services/google-map.service"
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private oneSignal: OneSignal,
    private translate: TranslateService,
    private googleMaps : GoogleMapService
  ) {
    const lng = localStorage.getItem("language");
    if (!lng || lng === null) {
      localStorage.setItem("language", "en");
    }
    this.translate.use(localStorage.getItem("language"));
    this.initializeApp();

    localStorage.setItem("selectedCountry", "IE");

    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(async () => {
        await this.oneSignal.startInit(
          environment.onesignal.appId,
          environment.onesignal.googleProjectNumber
        );
        this.oneSignal.getIds().then((data) => {
          localStorage.setItem("fcm", data.userId);
        });
        await this.oneSignal.endInit();
      }, 1000);

      this.platform.backButton.subscribe(async () => {
        console.log(
          "asd",
          this.router.url,
          "ad",
          this.router.isActive("/tabs/", true)
        );
        if (
          this.router.url.includes("/tabs/") ||
          this.router.url.includes("/login")
        ) {
          navigator["app"].exitApp();
        }
      });
      this.statusBar.backgroundColorByHexString("#d6e9d8");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CategoryPageRoutingModule } from "./category-routing.module";

import { NgxIonicImageViewerModule } from "ngx-ionic-image-viewer";
import { CategoryPage } from "./category.page";

import { MenuComponent } from "src/app/components/menu/menu.component";
import { ComponentsModule } from "src/app/components/components.module";
import { SharedModule } from "src/app/directives/shared.module";
import {OptionsPageModule} from "../options/options.module"

@NgModule({
  entryComponents: [MenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    ComponentsModule,
    SharedModule,
    NgxIonicImageViewerModule,
    OptionsPageModule
  ],
  declarations: [CategoryPage],
})
export class CategoryPageModule {}

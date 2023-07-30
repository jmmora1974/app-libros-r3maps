import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearlibroPageRoutingModule } from './crearlibro-routing.module';

import { CrearlibroPage } from './crearlibro.page';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearlibroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearlibroPage],
  providers: [BarcodeScanner]
})
export class CrearlibroPageModule {}

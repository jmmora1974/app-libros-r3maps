import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';

import { PerfilPage } from './perfil.page';
import { Geolocation } from '@capacitor/geolocation';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MapaPageModule } from '../mapa/mapa.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    ReactiveFormsModule,
    MapaPageModule
  ],
  declarations: [PerfilPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilPageModule {}

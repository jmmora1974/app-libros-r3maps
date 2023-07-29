import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

import { LibrosService } from '../../services/libros.service';
import { AuthService } from '../../services/auth.service';
import { ILibro } from 'src/app/models/ilibro';

import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import {MapaPageModule} from './../mapa/mapa.module'
import { map } from 'rxjs';
import { GooglemapsService } from 'src/app/services/googlemaps.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  libros$=this.librosService.libros$;
  librosMarkers: ILibro[]=[];

  constructor(
    private librosService: LibrosService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private googlemapsService:GooglemapsService,
    
  ) {
     librosService.getLibros().forEach(element => {
          this.librosMarkers;
          console.log ( element) 
          element. map(
            (libros:ILibro)=>{
              if(libros.ubicacion!=null){
                //this.googlemapsService.addMarker(libros.ubicacion)
                  this.librosMarkers.push(libros);
              }
            })  
      });
      
    setTimeout(() => {
      this.authService.userLogged();
      console.log (this.librosMarkers)
     this.googlemapsService.iniciaMapa();
     
    }, 2000);
  
}
  ngOnInit(): void {
    
  }

  async ionViewWillEnter() {
    setTimeout(()=>{

     // this.googlemapsService.iniciaMapa();
    },5000)
   
    };

    async init() {
      
    }

  comprarLibro (libro:ILibro){
    console.log(libro)
    const res = this.librosService.comprarLibro(libro);
    console.log (res)
  }

}

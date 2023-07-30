import { Component, ElementRef, Input, OnInit, Output, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

import { LibrosService } from '../../services/libros.service';
import { AuthService } from '../../services/auth.service';
import { ILibro } from 'src/app/models/ilibro';

import { GoogleMap} from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng, Marker } from '@capacitor/google-maps/dist/typings/definitions';
import {MapaPageModule} from './../mapa/mapa.module'
import { map } from 'rxjs';
import { GooglemapsService } from 'src/app/services/googlemaps.service';
import { title } from 'process';
import { SignupPage } from '../signup/signup.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  libros$=this.librosService.libros$;
  librosMarkers$=this.librosService.marcadoresLibros();
  map: any;
marker: any;
infowindow: any;
positionSet: Marker | undefined;

    
  constructor(
    private librosService: LibrosService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private googlemapsService:GooglemapsService,
    
  ) {
    
      
    setTimeout(() => {
      this.authService.userLogged();
     
    }, 2000);
  
}
@ViewChild('app-mapa') divMap!: ElementRef ;
@Output()  markersPositions= this.librosService.librosMarkers$;
/*  markersPositions:Marker[]=[
  {
    coordinate: {lat: 41.3849685,  lng: 2.1809364},
    title: 'pp1', 
    snippet: 'sub1',
    iconUrl:'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png'
  },
  ,{
    coordinate:{lat: 41.2385,  lng: 2.1609364},  title: 'pp2', snippet: 'sub2',
    iconUrl:'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png'
  },{
    coordinate:{lat:  41.3949685,  lng: 0.1909364}, title: 'pp3', snippet: 'sub3',
    iconUrl:'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png'
  },{
    coordinate:{lat:  41.3949685,  lng: 0.1909364}, title: 'pp4', snippet: 'sub4',
    iconUrl:'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png'
  }] as Marker[];*/


  ngOnInit(): void {
    
  }

  async ionViewDidEnter() {
     
    let mapOptions = {
      center: {lat:41.2,lng:2.3},
      zoom: 7,
      disableDefaultUI: true,
      clickableIcons: false,      
  }

 /* this.map = await new google.maps.Map (this.divMap!.nativeElement, mapOptions);
    */
    setTimeout(()=>{

     // this.googlemapsService.iniciaMapa();
    },5000)
   
    };

    async init() {
      
    }

  comprarLibro (libro:ILibro){
    if (!this.authService.getUserId()){
      this.router.navigateByUrl ('/login',{replaceUrl: true});
    }else{
      const res = this.librosService.comprarLibro(libro);
    }
    
   

  }
  addMarker (marcador:Marker):void{
    
    this.infowindow=new google.maps.InfoWindow();
    const marker=new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
    });
    marker.setPosition (marcador.coordinate);
    this.setInfowindow (marker, marcador.title!,marcador.snippet!)
    //this.map.panTo(latLng);
    //this.positionSet = marcador;
}

setInfowindow(marker: any, titulo: string, subtitulo: string){
        const contentString = '<div id="contentInsideMap">'+
                    '<div>'+
                    '</div>'+
                    '<p style=fint-weight: bold; margin-bottom: 5px;">'+
                    '<div id="bodyContent">'+
                    '<p class="normal m-0">'+
                    subtitulo+'</p>'+
                    '</div>'+
                    '</div>';
      this.infowindow.setContent (contentString);
      this.infowindow.open (this.map, marker);

}

 

}

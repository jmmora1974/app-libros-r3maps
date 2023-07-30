import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { GooglemapsService } from 'src/app/services/googlemaps.service';
import { environment } from 'src/environments/environment';

import { ModalController } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import { UsuarisService } from 'src/app/services/usuaris.service';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { title } from 'process';
import { Observable } from 'rxjs';





@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  
 
})
export class MapaComponent  implements OnInit {
 // markerPositions=[];

      
     
  markerClustererImagePath =
  'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png';

  markerOptions: google.maps.MarkerOptions = { 
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png'
   }

 //Coordenadas iniciales
 @Input() miUbicacion!:Marker;
label ={
titulo:'Ubicacion',
subtitulo: 'Mi ubicacion'
}

map: any;
marker: any;
infowindow: any;
//miUbicacion: Marker | undefined;

@ViewChild('map') divMap: ElementRef | undefined;
@Input({ required: true }) markersPositions:Observable<Marker[]>|undefined;

constructor(
private renderer:Renderer2, 
@Inject(DOCUMENT) private document:any,
private googlemapsService: GooglemapsService,
public modalController: ModalController,
private userService:UsuarisService,
) { }

ngOnInit() {
  this.mylocation ();
  this.init().then(()=>{
    
    if (this.markersPositions){
      this.markersPositions.forEach((elemen)=>{
      
        elemen.map((libroMarcador)=>{
            if (libroMarcador){
               this.addMarker(libroMarcador);
             }
        })
        this.mylocation ();
           //this.setInfowindow (this.marker, elemen.title?elemen.title:'', elemen.snippet?elemen.snippet:'')
      })
     

    }
    
  });
  
}
ionViewDidEnter(){
 // this.init();

  this.mylocation();

}

async init () {
await this.googlemapsService.init(this.renderer,this.document).then(()=>{
     this.initMap();
     
}).catch((error)=>{console.error;console.log('aqui')})
}

async initMap (){

      let mapOptions = {
          center: {lat: 41.3849685, 
            lng: 2.1609364}
          ,
          zoom: 6,
          disableDefaultUI: true,
          clickableIcons: false,      
      }

      this.map = await new google.maps.Map (this.divMap!.nativeElement, mapOptions);
      this.infowindow=new google.maps.InfoWindow();
}

addMarker (marcador:Marker):void{
          
          this.marker=new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            draggable: false,
            icon:marcador.iconUrl
          });
          this.marker.setPosition (marcador.coordinate);
          this.setInfowindow (this.marker, marcador.title!,marcador.snippet!)
                    
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

async mylocation ():Promise<LatLng>{
  

  return Geolocation.getCurrentPosition().then ((res)=>{
            const position:Marker = {
                        coordinate:{ lat: res.coords.latitude,
                        lng: res.coords.longitude},
                        title:'Mi ubucacion',
                        snippet:"Mi ubicacion"
                      }
            this.miUbicacion=position;
            this.addMarker(this.miUbicacion);
    
  }) as Promise<LatLng>;
 
}

aceptar(){
    //console.log ('estas a ', this.miUbicacion);

}

async addDirection(){
    const ubicacion= (await this.userService.getUser()).ubicacion;
      
      let positionInput={
        lat:41.3849685, lng:2.1609364
        
      };
      if (ubicacion!=null){
        positionInput=ubicacion;
      }

      const modalAdd = await this.modalController.create({
        component: MapaComponent,
        //mode: 'ios',
        //swipeToClose: true ,
        componentProps: {position: positionInput}

      });
      
      await modalAdd.present ();
      const {data} = await modalAdd.onWillDismiss();
      if (data) {
       
        (await this.userService.getUser()).ubicacion =data.pos;
      
      }
      

  }

}

import { Component, ElementRef, Input, OnInit, Output, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';

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
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

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
    private platform:Platform,
    
  ) {
    
      
    setTimeout(() => {
      this.authService.userLogged();
     
    }, 2000);
  
}
@ViewChild('app-mapa') divMap!: ElementRef ;
@Output()  markersPositions= this.librosService.librosMarkers$;


  async ngOnInit() {

    if (await PushNotifications.checkPermissions()){
          PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
              // Register with Apple / Google to receive push via APNS/FCM
              
              PushNotifications.register();
              console.log('Servicio de mensajeria iniciado.');
            } else {
              // Show some error
              console.log('Ha ocurrido un fallo en el servicio de mensajeria');
            }
          });
          // On success, we should be able to receive notifications
          PushNotifications.addListener('registration',
            (token: Token) => {
              alert('Push registration success, token: ' + token.value);
            }
          );

          // Some issue with our setup and push will not work
          PushNotifications.addListener('registrationError',
            (error: any) => {
              alert('Error on registration: ' + JSON.stringify(error));
            }
          );

          // Show us the notification payload if the app is open on our device
          PushNotifications.addListener('pushNotificationReceived',
            (notification: PushNotificationSchema) => {
              alert('Push received: ' + JSON.stringify(notification));
            }
          );

          // Method called when tapping on a notification
          PushNotifications.addListener('pushNotificationActionPerformed',
            (notification: ActionPerformed) => {
              alert('Push action performed: ' + JSON.stringify(notification));
            }
          );
        }
    
  }

  async ionViewDidEnter() {
    }

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

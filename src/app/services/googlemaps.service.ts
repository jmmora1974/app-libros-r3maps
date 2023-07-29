import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap  } from '@capacitor/google-maps';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GooglemapsService {
coordenadas:LatLng={lat:41.8,lng:2.43};
posicion!:LatLng;
  constructor() { 
    Geolocation.getCurrentPosition()
    .then((coord)=>{
      this.coordenadas.lat=coord.coords.latitude;
      this.coordenadas.lng=coord.coords.longitude;
      console.log(this.coordenadas, 'cooordena' );
      this.posicion=this.coordenadas;
    })
    .catch((error)=>{console.log(error)})

  }


async  iniciaMapa(){
  const apiKey = environment.googleApiKey;

    const mapRef = document.getElementById('map');
    if (mapRef){  
        //await this.posicion;
        console.log('Current position:', this.coordenadas);
        const newMap = await GoogleMap.create({
          id: 'my-map', // Unique identifier for this map instance
          element:  mapRef, // reference to the capacitor-google-map element
          apiKey: apiKey, // Your Google Maps API Key
          config: {
            center: this.posicion? this.posicion:this.coordenadas,
            /* {
              // The initial position to be rendered by the map
              lat: 33.6,
              lng: -117.9,
            }*/
            zoom: 15, // The initial zoom level to be rendered by the map
            disableDefaultUI: true,
            clickableIcons: false,     
          },
        
          });
          // Add a marker to the map
          const markerId = await newMap.addMarker({
                  coordinate: this.coordenadas

          }).then(()=>{
            console.log ('coord ',this.posicion)
          });

          }
  }
  
}

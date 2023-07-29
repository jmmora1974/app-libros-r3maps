import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { GooglemapsService } from 'src/app/services/googlemaps.service';
import { environment } from 'src/environments/environment';
import { ILibro } from '../../models/ilibro';



@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  
 
})
export class MapaComponent  implements OnInit {
  markers=[{lat:  41.3849685,  lng: 2.1609364},{lat:  41.2385,  lng: 3.1609364},{lat:  40.3849685,  lng: 2.1409364}]
  markerClustererImagePath =
  'https://developers.googhttps://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.pngle.com/maps/documentation/javascript/examples/markerclusterer/m';

  markerOptions: google.maps.MarkerOptions = { 
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png'
   }

  constructor(private googlemapsService:GooglemapsService) { }
 apiKey = environment.googleApiKey;
  ngOnInit() {
   
  }
  
  ionViewWillEnter() {
    
    //this.googlemapsService.iniciaMapa();
    };

    async init() {
      
    }

  async iniciaMapa(){
          
      const printCurrentPosition = async () => {
            const coordinates = await Geolocation.getCurrentPosition();

        //console.log('Current position:', coordinates);
        };
    const mapRef = document.getElementById('map');
    if (mapRef){

          const newMap = await GoogleMap.create({
            id: 'map2', // Unique identifier for this map instance
            element:  mapRef, // reference to the capacitor-google-map element
            apiKey: this.apiKey, // Your Google Maps API Key
            config: {
              center: {
                // The initial position to be rendered by the map
                lat:  41.3849685,
                lng: 2.1609364,
              },
              zoom: 13, // The initial zoom level to be rendered by the map
            },
          
    });  
  }
  }
  addMarcadores(marcadores:ILibro[]){

  }

}

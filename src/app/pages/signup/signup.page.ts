import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { UsuarisService } from 'src/app/services/usuaris.service';
import { IUser } from 'src/app/models/iuser';
import { Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  current_year: number = new Date().getFullYear();
  //markersPositions: Observable<Marker[]>=Observable<void>;
  credentials!: FormGroup;
  submit_attempt: boolean = false;
  miUbicacion!:Marker;
  marker!: google.maps.Marker;
  @ViewChild('map') divMap: ElementRef | undefined;
  @Output()  markersPositions:Observable<Marker[]> | undefined;

  constructor(
    private authService: AuthService,
    private userService: UsuarisService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) {
    this.mylocation();
   }

  ngOnInit() {
    // Setup form
    this.credentials = this.formBuilder.group({
      displayname: ['', Validators.compose([ Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      password_repeat: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      nom: ['', Validators.compose([ Validators.required])],
      cognom: ['', Validators.compose([ Validators.required])],      
      phone: [''],
      calle: ['', Validators.compose([ Validators.required])],
      numero:  [''],
      piso:  [''],
      puerta: [''],
      ciudad: ['', Validators.compose([ Validators.required])],
      pais: ['', Validators.compose([ Validators.required])],

    });
  
  }


  get name(){return this.credentials.get('name');}  
  get email(){ return this.credentials.get('email');}  
  get password(){return this.credentials.get('password');}
   

  // Sign up
async signUp(){

    this.submit_attempt = true;

    // If email or password empty
    if (this.credentials.value.name == '' || this.credentials.value.email == '' || this.credentials.value.password == '' || this.credentials.value.password_repeat == '') {
      this.toastService.presentToast('Error', 'Por favor, rellena los campos obligatorios', 'top', 'danger', 4000);

      // If passwords do not match
    } else if (this.credentials.value.password != this.credentials.value.password_repeat) {
      this.toastService.presentToast('Error', 'Las contraseñas han de coincidir', 'top', 'danger', 4000);

    } else {

      // sign up logic
      if (this.credentials.invalid) {
        return;
      }

      const loading = await this.loadingController.create();
      await loading.present();

      const user = await this.authService.register(this.credentials.value);

      if (user) {
        const posicion:LatLng={
            lat: this.miUbicacion.coordinate.lat,
            lng: this.miUbicacion.coordinate.lat
          }
        const myUser: IUser = {
          id: this.authService.getUserId(),
          displayname: this.credentials.get('displayname')?.value,
          email: this.credentials.get('email')?.value,
          password: this.credentials.get('password')?.value,
          nom: this.credentials.get('nom')?.value,
          cognom: this.credentials.get('cognom')?.value,
          calle: this.credentials.get('calle')?.value,
          numero:this.credentials.get('numero')?.value,
          piso:this.credentials.get('piso')?.value,
          puerta:this.credentials.get('puerta')?.value,
          ciudad:this.credentials.get('ciudad')?.value,
          pais:this.credentials.get('pais')?.value,
          ubicacion: posicion,
          phone:this.credentials.get('phone')?.value,
          tokenPush: '',
          avatar: {
            storagePath: '', storageBase64: ''
          },
          imageUrl: ''
        }
  
        await this.userService.addUser(myUser);
  
        await loading.dismiss();
  
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        this.showAlert('Registration failed', 'Please try again!');
      }

 
     
    }
  }

   async showAlert(header:string, message:string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
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
              //this.addMarker(this.miUbicacion);
      
    }) as Promise<LatLng>;
   
  }

  addMarker (marcador:Marker):void{
    //let latLng = new google.maps.LatLng(position.lat, position.lng)
    //console.log ('admk',latLng)
    this.marker=new google.maps.Marker({
     // map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
    });
    this.marker.setPosition (marcador.coordinate);
    this.setInfowindow (this.marker, marcador.title!,marcador.snippet!)
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
//this.infowindow.setContent (contentString);
//this.infowindow.open (this.map, marker);

}

}

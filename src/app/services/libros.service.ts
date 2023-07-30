import { Inject, Injectable } from '@angular/core';
import { ILibro } from '../models/ilibro';
import { AuthService } from './auth.service';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDocs, query, updateDoc, where, getFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, identity, map } from 'rxjs';
import { User, UserCredential, provideAuth } from '@angular/fire/auth';
import { getDownloadURL } from '@angular/fire/storage';
import { PhotoService } from './photo.service';
import { ToastService } from './toast.service';
import { Marker } from '@capacitor/google-maps';


@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  usuariLogat!: User ;
  //libros:ILibro[]=[];
  private libros=new BehaviorSubject<ILibro[]>([]);
  libros$=this.libros.asObservable();
  
  private librospropietari=new BehaviorSubject<ILibro[]>([]);
	librospropietari$=this.librospropietari.asObservable();
  private misLibros:ILibro[]=[];

  private librosVendidos=new BehaviorSubject<ILibro[]>([]);
	librosVendidos$=this.librosVendidos.asObservable();
  
  private librosMarkers=new BehaviorSubject<Marker[]>([]);
  librosMarkers$=this.librosMarkers.asObservable();
  marcardores: Marker[] =[];

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private photoService: PhotoService,
    private toast:ToastService
    ) {
     
    this.libros$=this.getLibros();
    this.usuariLogat= this.authService.userLogged()!;
    if (this.usuariLogat){
      this.getLibrobyVendidos(this.usuariLogat.uid).then((data)=>{
        this.librosVendidos.next(data)
      })
    } 
  }
  // Crea un nuevo libroy lo almace
  createLibro(libro: ILibro) {
    
    const librosRef = collection(this.firestore, 'libros');
    
    const libronuevo=addDoc(librosRef, libro);
    
    return libronuevo;
  }
  
  // Obtiene el libro por su id.
  getLibrobyId(id: string) {
    const LibroDocRef = doc(this.firestore, `libros/${id}`);

    return docData(LibroDocRef, { idField: 'id' }) as Observable<ILibro>;
  }

   // Obtiene los libros del propietario.
  async getLibrobyPropietario(prop: string){
        this.libros$.forEach((elements)=>{
        this.misLibros=[];
          for (let x=0;x<elements.length;x++){
            if (elements[x].propietario==prop){
              this.misLibros.push(elements[x])
            }
          }
          if (this.misLibros) { 
           
              this.librospropietari.next(this.misLibros);
            
          }
        });
         
  }

  //Obtiene la lista de libros por el propietario directamente de firebase.
  async getLibrobyPropietario1(userProp: string):Promise<any> {
    
    const q = query(collection(this.firestore, 'libros'), where('propietario', '==', userProp));
    const querySnapshot = await getDocs(q);
     return querySnapshot.docs.map(doc => doc.data() as ILibro);
  }
  
  //Obtiene la lista de libros por el propietario del observable y aplica filtro.
  async getLibrobyPropietario2(userProp: string): Promise<Observable<ILibro | null>> {
    return this.libros$.pipe(
      map(
        (libros:ILibro[])=>
            libros.find((libro:ILibro)=>libro.propietario==userProp)||null
      )
    )
  }
  
    // Obtiene los libros vendidos directamente de firebase.
    async getLibrobyVendidos(userProp: string) {
      const q = query(collection(this.firestore, 'transacciones'), where('vendedor', '==', userProp));
      const querySnapshot = await getDocs(q);
      let librosV = querySnapshot.docs.map(doc => doc.data() as ILibro);
      this.librosVendidos.next(librosV)
      return librosV;
    }



  // Obtiene los libros comprados directamente de firebase.
  async getLibrobyComprador(userComp: string) {
    const q = query(collection(this.firestore, 'transacciones'), where('comprador', '==', userComp));
    const querySnapshot = await getDocs(q);
    let libros = querySnapshot.docs.map(doc => doc.data() as ILibro);
    return libros;
  }

  // Obtiene la lista de libros
  getLibros() {
    const librosRef = collection(this.firestore, 'libros');
    
    return collectionData(librosRef, { idField: 'id'}) as Observable<ILibro[]>;
  }

  // Actualiza un libro
  updateLibro( libro: ILibro) {
    const vacancaDocRef = doc(this.firestore, `libros/${libro.id}`);
    return updateDoc(vacancaDocRef, {
      titulo: libro.titulo,
      categoria: libro.categoria,
      descripcion: libro.descripcion,
      valoracion: libro.valoracion,
      precio: libro.precio ,
      imageUrl:libro.imageUrl
    });
  }
  // Borra el libro
  deleteLibro(libro: ILibro) {
    const libroDocRef = doc(this.firestore, `libros/${libro.id}`);
    deleteDoc(libroDocRef);
    if (libro.imageUrl) {    
          const restBorrar=this.photoService.deleteImage(libro.imageUrl);
    } 
  }
  //Gestiona la compra del libro.
  comprarLibro(libro:ILibro){
  
    if (libro.propietario==this.authService.getUserId()){
      this.toast.presentToast('Compra no permita','No puedes comprar tus libros','fix','danger', 2000,'danger');
      return 'Compra no permita. No puedes comprar tus libros';
    }

    const compraAutorizada = this.aprobarCompra ();

    if (compraAutorizada){
      const librosRef = collection(this.firestore, 'transacciones');
      let libroVendido={
        titulo: libro.titulo,
        categoria: libro.categoria,
        descripcion: libro.descripcion,
        precio: libro.precio,
        vendedor: libro.propietario,
        comprador: this.authService.getUserId(),
        fechaTransaccion: Date.now()
      }
      this.toast.presentToast('Compra realizada','Libros comprado con exito','bottom','success', 3000,'chart');
     
      const libronuevo=addDoc(librosRef, libroVendido);
      this.deleteLibro(libro)
      return libronuevo;
    } else {
      this.toast.presentToast('Compra no realizada','La compra del libro no ha sido satisfactoria, lago ha ocurrido mal','fix','danger', 2000,'danger');
     
      return 'Compra no aprobada'
    }
  }

  //Comprueba si la compra/pago se ha dealizado..se ha generado un mock para realizar pruebas.
  aprobarCompra (): boolean{

   // Returns a random integer from 0 to 9:
   let unNumero=Math.floor(Math.random() * 5);
  
   //Generamos un mock para simular compras fallidas. La probabilidad puede cambiar según queremos.
   if (unNumero==3) {
    
    return true;
   }else {
    return false;
  }
  }

  marcadoresLibros(){
    return this.getLibros().forEach(element => {
      this.marcardores=[];
      
      element. map(
        
        (libros:ILibro)=>{
          
          if(libros.ubicacion!=null){
            //this.googlemapsService.addMarker(libros.ubicacion)
              const marcadorLibro={
                coordinate: libros.ubicacion,
                title: libros.titulo,
                snippet: libros.titulo,
                iconUrl: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png'
                
              } as Marker;
              this.marcardores.push(marcadorLibro);       
          }
        }) 
        if (this.marcardores) {
          this.librosMarkers.next(this.marcardores);
        }
  });
  }
}

import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, limit, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarisService {
  private userLogat=new BehaviorSubject<IUser>({
    nom:'',
    cognom: '',  
    imageUrl: '',
    tokenPush: ''
    
  });
  userLogat$=this.userLogat.asObservable();
  
  constructor(
    private firestore: Firestore, private authService: AuthService
    ) { 
      if(authService.getUserId()){
      this.getUser().then ((usu)=>{
        console.log (usu);
        this.userLogat.next(usu);
        
      })}
    }

  async getUser(): Promise<IUser> {
    const q = query(collection(this.firestore, "users"), where("id", "==", this.authService.getUserId()));
    const querySnapshot = await getDocs(q);
    let myUser: IUser[] = querySnapshot.docs.map(doc => doc.data() as IUser);
    return myUser[0];
  }

  addUser(user: IUser) {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, user);
  }

  deleteUser(user: IUser) {
    const UserDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(UserDocRef);
  }

  async updateUser(user: IUser) {
    // const UserDocRef = doc(this.firestore, `users/${user.id}`);
    const q = query(collection(this.firestore, "users"), where("id", "==", this.authService.getUserId()), limit(1));
    const querySnapshot = await getDocs(q);
    const userDocRef = querySnapshot.docs.map(doc => doc);
    console.log(userDocRef[0].ref)
    return updateDoc(userDocRef[0].ref, {
      nom: user.nom,
      cognom: user.cognom,  
      displayname: user.displayname,
      phone: user.phone,
      calle: user.calle,
      numero: user.numero,
      piso: user.piso,
      puerta: user.puerta,
      ciudad: user.ciudad,
      pais: user.pais
      
      
    });
  }
  
  async getUserById(id: string): Promise<IUser> {
    const q = query(collection(this.firestore, "users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    let myUser: IUser[] = querySnapshot.docs.map(doc => doc.data() as IUser);
    return myUser[0];
  }


}

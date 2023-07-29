import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";

export interface IEmailPwd {
    email: string;
    password: string;
}

export interface IUser  {
    
    id?:string;
    displayname?:string;
    nom: string;
    cognom: string;
    email?: string;
    //password: string;
    address?: string;
    phone?:number;
    password?: string;
    calle?: string;
    numero?: number;
    piso?: number;
    puerta?: string;
    ciudad?: string;
    pais?: string;
    ubicacion?: LatLng;
    imageUrl: string;
    avatar?: IUserAvatar;
    tokenPush: string;
}
export interface IUserAvatar {
    storagePath: string;
    storageBase64: string;
}


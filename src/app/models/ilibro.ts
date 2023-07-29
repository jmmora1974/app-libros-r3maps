import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";

export interface ILibro {
    id?:string;
    titulo: string,
    categoria: string,
    descripcion: string,
    valoracion: number,
    precio: number,
    propietario:string,
    displayPropietario?:string,
    ciudad?:string,
    ubicacion?:LatLng,
    comprador?:string,
    imageUrl?:string
    galeriaFotos?: IUserPhoto[],



}
export interface IUserPhoto {
    filepath: string;
    webviewPath?: string;
}
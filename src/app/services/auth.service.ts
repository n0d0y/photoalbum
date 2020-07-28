import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:sign';
  private apikey = 'AIzaSyB-LAYQcV1Xq0Fcc8bn9iiRBi4ksGoU3N0';

  userToken: string;
  expires: number;

  // Crear nuevos usuarios
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor( private http: HttpClient ) {
    this.leerToken();
  }


  logout() {
    localStorage.removeItem('token');
  }

  login( usuario: UsuarioModel) {

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }InWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        // tslint:disable-next-line: no-string-literal
        this.guardarToken( resp['idToken'], resp['expiresIn'] );
        return resp;
      })
    );
  }

  nuevoUsuario( usuario: UsuarioModel) {

    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }Up?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp => {
        // tslint:disable-next-line: no-string-literal
        this.guardarToken( resp['idToken'], resp['expiresIn'] );
        return resp;
      })
    );
  }


  private guardarToken( idToken: string, expiresIn?: number ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    // tslint:disable-next-line: prefer-const
    let hoy = new Date();
    hoy.setSeconds( expiresIn );

    localStorage.setItem('expira', hoy.getTime().toString() );
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }
  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }
  }
}

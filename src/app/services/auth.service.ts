import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from 'src/app/model/user';

@Injectable()
export class AuthService {
  
  private registerUrl: string = "http://localhost:8080/users/register";
  private loginUrl: string = "http://localhost:8080/users/login";

  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<boolean> {
    return this.http.post<boolean>(this.registerUrl, user)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of(false);
      }))
  }

  loginUser(user: User): Observable<boolean> {
    return this.http.post<boolean>(this.loginUrl, user)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of(false);
      }))
  }

}
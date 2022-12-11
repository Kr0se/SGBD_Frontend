import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { UserAuth } from 'src/app/model/userAuth';

@Injectable()
export class AuthService {
  
  private registerUrl: string = "http://localhost:8080/users/register";
  private loginUrl: string = "http://localhost:8080/users/login";
  private deleteUrl: string = "http://localhost:8080/users";

  constructor(private http: HttpClient) { }

  registerUser(user: UserAuth): Observable<boolean> {
    return this.http.post<boolean>(this.registerUrl, user)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of(false);
      }))
  }

  loginUser(user: UserAuth): Observable<boolean> {
    return this.http.post<boolean>(this.loginUrl, user)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of(false);
      }))
  }

  deleteUser(username: string): Observable<boolean> {
    return this.http.delete<boolean>(this.deleteUrl.concat("/" + username + "/deleteUsername"))
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of(false);
      }))
  }

}
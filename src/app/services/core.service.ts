import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from 'src/app/model/user';

@Injectable()
export class CoreService {
  
  private getUserUrl: string = "http://localhost:8080/users/getUserByUsername?username=";

  constructor(private http: HttpClient) { }

  getUser(username: string): Observable<any> {
    return this.http.get<any>(this.getUserUrl.concat(username))
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of();
      }))
  }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UserAuth } from 'src/app/model/userAuth';
import { User } from '../model/user';
import { Folder } from '../model/folder';

@Injectable()
export class CoreService {
  
  private getUserUrl: string = "http://localhost:8080/users/getUserByUsername?username=";
  private addFolderUrl: string = "http://localhost:8080/users";

  constructor(private http: HttpClient) { }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(this.getUserUrl.concat(username))
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of();
      }))
  }

  addFolder(username: string, folder: Folder): Observable<User> {
    return this.http.post<User>(this.addFolderUrl.concat("/" + username + "/addFolder"), folder)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of();
      }))
  }

  removeFolder(username: string, folder: Folder): Observable<User> {
    return this.http.post<User>(this.addFolderUrl.concat("/" + username + "/removeFolder"), folder)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of();
      }))
  }

  renameFolder(username: string, folder: Folder): Observable<User> {
    return this.http.post<User>(this.addFolderUrl.concat("/" + username + "/renameFolder"), folder)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of();
      }))
  }

}
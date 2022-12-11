import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { UserAuth } from 'src/app/model/userAuth';
import { Fitxer, User } from '../model/user';
import { Folder } from '../model/folder';
import { FileDTO } from '../model/file';

@Injectable()
export class SearchService {

  private getAllUsersByUsernameUrl: string = "http://localhost:8080/users";
  private getAllUserFilesUrl: string = "http://localhost:8080/fitxers";


  constructor(private http: HttpClient) { }
  
  getAllUsersByUsername(username: string, query: string | undefined): Observable<User[]> {
    return this.http.get<User[]>(this.getAllUsersByUsernameUrl.concat("/" + username + "/getAllUsersByUsername?query=" + query))
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of();
      }))
  }

  getAllUserFiles(username: string, query: string | undefined): Observable<Fitxer[]> {
    return this.http.get<Fitxer[]>(this.getAllUserFilesUrl.concat("/" + username + "/nomstarts?nom=" + query))
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          console.error('There was an error!', error);

          // after handling error, return a new observable 
          // that doesn't emit any values and completes
          return of();
      }))
  }

}
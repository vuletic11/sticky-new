import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, empty, Subject, observable } from 'rxjs';
import { AuthService } from './auth.service';
import {catchError, switchMap, tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  refreshingAccessToken: boolean;

  accessTokenRefreshed: Subject<any> = new Subject();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    //handle the request
    request = this.addAuthHeader(request);

    // call next() and handle the repsponse
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.log(error);

    if(error.status === 401){
      //401 error so user is a+unauthorized

      //refresh the access token
      return this.refreshAccessToken().pipe(
        switchMap(()=>{
          request = this.addAuthHeader(request);
          return next.handle(request);
        }),
        catchError((err:any)=>{
          console.log(err);
          this.authService.logout();
          return empty();
        })
      )
    }

        return throwError(error)
      })
    )
  }


  refreshAccessToken(){
    if(this.refreshingAccessToken){
      return new Observable(observer=>{
        return this.accessTokenRefreshed.subscribe(()=>{
          //this runs when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      })
    }else{
      this.refreshingAccessToken = true;
      // we want to call method in auth service to send a req to refresh the access token
      return this.authService.getNewAccesToken().pipe(
        tap(()=>{
          console.log('access token refreshed');
          this.refreshingAccessToken= false;
          //this.accessTokenRefreshed.next();
        })
      )
    }
  
  }


  addAuthHeader(request:HttpRequest<any>){
    //get the access token
    const token = this.authService.getAccessToken();

    if(token){
       //append the access token to the request header
      return request.clone({
        setHeaders:{
          'x-access-token':token
        }
      })
    }
    return request;
  }
}

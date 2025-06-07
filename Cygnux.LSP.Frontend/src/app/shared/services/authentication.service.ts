import { Inject, Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { Observable } from 'rxjs';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
     @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) { }


  sendOTPMail(id:string,filters:any): Observable<IApiBaseResponse<any>>{
     return this.apiHandlerService.Post(`Authentication/SendOTPMail?Entryby=${id}`, filters);
  }
}

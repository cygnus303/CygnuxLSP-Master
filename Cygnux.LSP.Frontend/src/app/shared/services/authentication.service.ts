import { Inject, Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { Observable } from 'rxjs';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/lsp.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
     @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) { }


  sendOTPMail(id:string,filters:any): Observable<IApiBaseResponse<CommonResponse>>{
     return this.apiHandlerService.Post(`Authentication/SendOTPMail?Entryby=${id}`, filters);
  }

  verifyOTP(filters:any): Observable<IApiBaseResponse<CommonResponse>>{
      return this.apiHandlerService.Post(`Authentication/verifyOTP`, filters);
  }

  resendOTP(filters:any): Observable<IApiBaseResponse<CommonResponse>>{
      return this.apiHandlerService.Post(`Authentication/resendOTP`, filters);
  }

  resetPassword(filters:any): Observable<IApiBaseResponse<CommonResponse>>{
      return this.apiHandlerService.Post(`Authentication/ResetPassword`, filters);
  }
}

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/lsp.model';
import { AddUserRequest, UserResponse } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getUserList(page: number = 1, pageSize: number = 100): Observable<IApiBaseResponse<UserResponse[]>> {
    let params: ParamsType = {
      page: page,
      pageSize: pageSize,
    };
    return this.apiHandlerService.Get('user', params);
  }

  getUserDetails(id: string): Observable<IApiBaseResponse<UserResponse>> {
    return this.apiHandlerService.Get('user/' + id);
  }

  addUser(adduserRequest: AddUserRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('user', adduserRequest);
  }

  updateUser(id: string, adduserRequest: AddUserRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('user/' + id, adduserRequest);
  }

  deleteUser(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('user/' + id, null);
  }
}

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/lsp.model';
import { AddUserRequest, DeleteUserRequest, UserResponse } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getUserList(filters:any): Observable<IApiBaseResponse<UserResponse[]>> {
    return this.apiHandlerService.Get('user', filters);
  }

  getUserDetails(id: string,userId:string): Observable<IApiBaseResponse<UserResponse>> {
    return this.apiHandlerService.Get(`user/${id}?userId=${userId}`);
  }

  addUser(adduserRequest: AddUserRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('user', adduserRequest);
  }

  updateUser(id: string, adduserRequest: AddUserRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('user/' + id, adduserRequest);
  }

  deleteUser(id: string,deleteUserRequest:DeleteUserRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch(`user/DeleteUser?id=${id}` , deleteUserRequest);
  }
}

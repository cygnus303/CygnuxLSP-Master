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

  getUserList(id:string,filters:any): Observable<IApiBaseResponse<UserResponse[]>> {
    return this.apiHandlerService.Get(`User/GetUserList?userId=${id}`, filters);
  }

  getUserDetails(id: string): Observable<IApiBaseResponse<UserResponse>> {
    return this.apiHandlerService.Get(`User/GetUserDetail?id=${id}`);
  }

  addUser(adduserRequest: AddUserRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('User/AddUser', adduserRequest);
  }

  updateUser(id: string, adduserRequest: AddUserRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post(`User/UpdateUser?id=${id}`, adduserRequest);
  }

  deleteUser(id: string,deleteUserRequest:DeleteUserRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch(`user/DeleteUser?id=${id}` , deleteUserRequest);
  }
}

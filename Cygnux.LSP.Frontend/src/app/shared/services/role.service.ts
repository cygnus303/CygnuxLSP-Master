import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { RoleResponse } from '../models/role.model';
import { CommonResponse } from '../models/lsp.model';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getRoleList(page: number = 1, pageSize: number = 100): Observable<IApiBaseResponse<RoleResponse[]>> {
    let params: ParamsType = {
      page: page,
      pageSize: pageSize,
    };
    return this.apiHandlerService.Get('role', params);
  }

  getRoleDetails(id: string): Observable<IApiBaseResponse<RoleResponse>> {
    return this.apiHandlerService.Get('role/' + id);
  }

  addRole(addRoleRequest: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('role', addRoleRequest);
  }

  updateRole(id: string, addRoleRequest: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('role/' + id, addRoleRequest);
  }

  deleteRole(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('role/' + id, null);
  }
}

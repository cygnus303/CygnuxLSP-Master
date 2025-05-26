import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { DeleteRoleRequest, RoleRequest, RoleResponse } from '../models/role.model';
import { CommonResponse } from '../models/lsp.model';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getRoleList( filters:any): Observable<IApiBaseResponse<RoleResponse[]>> {
    return this.apiHandlerService.Get('role', filters);
  }

  getRoleDetails(id: string): Observable<IApiBaseResponse<RoleResponse>> {
    return this.apiHandlerService.Get('role/' + id);
  }

  addRole(addRoleRequest: RoleRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('role', addRoleRequest);
  }

  updateRole(id: string, addRoleRequest: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('role/' + id, addRoleRequest);
  }

  deleteRole(id: string , deleteRoleRequest:DeleteRoleRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch(`role/DeleteRole?roleId=${id}` , deleteRoleRequest);
  }
}

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { RolePermissionResponse } from '../models/role-permission.model';
import { CommonResponse } from '../models/lsp.model';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getRolePermissionList(): Observable<IApiBaseResponse<RolePermissionResponse[]>> {
    return this.apiHandlerService.Get('roleMenuPermission');
  }

  getRolePermissionByRole(id: string): Observable<IApiBaseResponse<RolePermissionResponse[]>> {
    return this.apiHandlerService.Get('roleMenuPermission/' + id);
  }

  createRolePermission(roleId: string, data: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('roleMenuPermission/' + roleId, data);
  }
}

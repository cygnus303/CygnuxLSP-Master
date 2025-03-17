import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { MenuResponse } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getMenuList(page: number = 1, pageSize: number = 100): Observable<IApiBaseResponse<MenuResponse[]>> {
    let params: ParamsType = {
      page: page,
      pageSize: pageSize,
    };
    return this.apiHandlerService.Get('menu', params);
  }

  getMenuDetails(id: string): Observable<IApiBaseResponse<MenuResponse>> {
    return this.apiHandlerService.Get('menu/' + id);
  }
}

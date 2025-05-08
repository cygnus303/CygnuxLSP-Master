import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { MenuResponse } from '../models/menu.model';
import { IdentityService } from './identity.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private cachedMenus: MenuResponse[] = [];

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService,private identifyService:IdentityService) { }

  getMenuList(page: number = 1, pageSize: number = 100): Observable<IApiBaseResponse<MenuResponse[]>> {
    let params: ParamsType = {
      userId:this.identifyService.getLoggedUserId()
    };
    return this.apiHandlerService.Get('menu', params);
  }

  getMenuDetails(id: string): Observable<IApiBaseResponse<MenuResponse>> {
    return this.apiHandlerService.Get('menu/' + id);
  }

  setMenusToCache(menus: MenuResponse[]) {
    this.cachedMenus = menus;
  }
  
  getMenusFromCache(): MenuResponse[] {
    return this.cachedMenus;
  }

}

import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import {
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';
import { CommonResponse } from '../models/lsp.model';
import { AddDocketRequest, DocketResponse } from '../models/docket.model';

@Injectable({
  providedIn: 'root',
})
export class DocketService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getDocketList(filters:any): Observable<IApiBaseResponse<DocketResponse[]>> {
    return this.apiHandlerService.Get('docket/GetDocketList', filters);
  }

  importDocket(formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/import', formData);
  }
  getDocketDetails(id: string,userId:string): Observable<IApiBaseResponse<DocketResponse>> {
    return this.apiHandlerService.Get(`docket/GetDocketDetail/${id}?userId=${userId}`);
  }

  addDocket(
    adddocketRequest: AddDocketRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/AddDocket', adddocketRequest);
  }

  updateDocket(
    id: string,
    adddocketRequest: AddDocketRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/UpdateDocket/' + id, adddocketRequest);
  }

  deleteDocket(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('docket/DeleteDocket/' + id, null);
  }
}

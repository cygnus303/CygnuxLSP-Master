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

  getDocketList(
    page: number = 1,
    pageSize: number = 100
  ): Observable<IApiBaseResponse<DocketResponse[]>> {
    let params: ParamsType = {
      page: page,
      pageSize: pageSize,
    };
    return this.apiHandlerService.Get('docket', params);
  }

  importDocket(formData: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/import', formData);
  }
  getDocketDetails(id: string): Observable<IApiBaseResponse<DocketResponse>> {
    return this.apiHandlerService.Get('docket/' + id);
  }

  addDocket(
    adddocketRequest: AddDocketRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket', adddocketRequest);
  }

  updateDocket(
    id: string,
    adddocketRequest: AddDocketRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('docket/' + id, adddocketRequest);
  }

  deleteDocket(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('docket/' + id, null);
  }
}

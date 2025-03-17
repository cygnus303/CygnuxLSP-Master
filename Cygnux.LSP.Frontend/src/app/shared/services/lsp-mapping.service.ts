import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import {
  IApiBaseResponse,
  ParamsType,
} from '../interfaces/api-base-action-response';
import {
  AddLspRequest,
  CommonResponse,
  LspResponse,
} from '../models/lsp.model';
import { LspMappingResponse } from '../models/lsp-mapping.model';
import { LspTatResponse } from '../models/lsp-tat.model';
import { CustomerResponse } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class LspMappingService {
  constructor(
    @Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService
  ) {}

  getLspMappingList(
    page: number,
    pageSize: number
  ): Observable<IApiBaseResponse<LspMappingResponse[]>> {
    let params: ParamsType = {
      page: page,
      pageSize: pageSize,
    };
    return this.apiHandlerService.Get('customerLsp', params);
  }

  getLspMappingDetails(
    id: string
  ): Observable<IApiBaseResponse<LspMappingResponse>> {
    return this.apiHandlerService.Get('customerLsp/' + id);
  }

  getLspTatList(
    page: number = 1,
    pageSize: number = 100
  ): Observable<IApiBaseResponse<LspTatResponse[]>> {
    let params: ParamsType = {
      page: page,
      pageSize: pageSize,
    };
    return this.apiHandlerService.Get('customerLsp/Tat', params);
  }

  getLspTatDetails(id: string): Observable<IApiBaseResponse<LspTatResponse>> {
    return this.apiHandlerService.Get('customerLsp/Tat/' + id);
  }

  getCustomers(): Observable<IApiBaseResponse<CustomerResponse[]>> {
    return this.apiHandlerService.Get('customerLsp/Tat/Customers');
  }

  getLsps(): Observable<IApiBaseResponse<LspResponse[]>> {
    return this.apiHandlerService.Get('customerLsp/Tat/Lsps');
  }

  addLspMapping(
    addLspRequest: AddLspRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customerLsp', addLspRequest);
  }

  updateLspMapping(
    id: string,
    addLspRequest: AddLspRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customerLsp/' + id, addLspRequest);
  }
  addLspTat(
    addLspRequest: AddLspRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customerLsp/Tat', addLspRequest);
  }

  updateLspTat(
    id: string,
    addLspRequest: AddLspRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customerLsp/Tat/' + id, addLspRequest);
  }

  deleteLspMapping(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('customerLsp/' + id, null);
  }

  deleteLspMappingTat(
    id: string
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('customerLsp/Tat/' + id, null);
  }
}

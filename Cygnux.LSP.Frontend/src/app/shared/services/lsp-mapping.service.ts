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

  getLspMappingList(filters:any): Observable<IApiBaseResponse<LspMappingResponse[]>> {
    return this.apiHandlerService.Get('CustomerLsp/CustomerLspMappingList', filters);
  }

  getLspMappingDetails(
    id: string,userId:string
  ): Observable<IApiBaseResponse<LspMappingResponse>> {
    return this.apiHandlerService.Get(`customerLsp/${id}?userId=${userId}`);
  }

  getLspTatList(filters:any): Observable<IApiBaseResponse<LspTatResponse[]>> {
    return this.apiHandlerService.Get('customerLsp/Tat', filters);
  }

  getLspTatDetails(id: string,userId:string): Observable<IApiBaseResponse<LspTatResponse>> {
    return this.apiHandlerService.Get(`customerLsp/Tat/${id}?userId=${userId}`);
  }

  getCustomers(id:string): Observable<IApiBaseResponse<CustomerResponse[]>> {
    return this.apiHandlerService.Get(`customerLsp/Tat/Customers?loginid=${id}`);
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

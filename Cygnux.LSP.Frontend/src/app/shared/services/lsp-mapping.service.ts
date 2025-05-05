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

  getLspMappingList(id:string,filters:any): Observable<IApiBaseResponse<LspMappingResponse[]>> {
    return this.apiHandlerService.Get(`CustomerLsp/CustomerLspMappingList?Id=${id}`, filters);
  }

  getLspMappingDetails(
    id: string,
  ): Observable<IApiBaseResponse<LspMappingResponse>> {
    return this.apiHandlerService.Get(`CustomerLsp/CustomerLspMappingDetails/?Id=${id}`);
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

  getLsps(id:string): Observable<IApiBaseResponse<LspResponse[]>> {
    return this.apiHandlerService.Get(`customerLsp/Tat/Lsps?login=${id}`);
  }
  

  addLspMapping(
    addLspRequest: AddLspRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('CustomerLsp/AddLspMap', addLspRequest);
  }

  updateLspMapping(
    id: string,
    addLspRequest: AddLspRequest
  ): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post(`CustomerLsp/UpdateLspMap?LspMapId=${id}` , addLspRequest);
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

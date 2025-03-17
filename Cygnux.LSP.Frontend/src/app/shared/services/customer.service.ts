import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { AddCustomerRequest, CustomerResponse } from '../models/customer.model';
import { CommonResponse } from '../models/lsp.model';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getCustomerList(page: number = 1, pageSize: number = 100): Observable<IApiBaseResponse<CustomerResponse[]>> {
    let params: ParamsType = {
      page: page,
      pageSize: pageSize,
    };
    return this.apiHandlerService.Get('customer', params);
  }

  getCustomerDetails(id: string): Observable<IApiBaseResponse<CustomerResponse>> {
    return this.apiHandlerService.Get('customer/' + id);
  }

  addCustomer(addcustomerRequest: AddCustomerRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customer', addcustomerRequest);
  }

  updateCustomer(id: string, addcustomerRequest: AddCustomerRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customer/' + id, addcustomerRequest);
  }

  deleteCustomer(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch('customer/' + id, null);
  }
}

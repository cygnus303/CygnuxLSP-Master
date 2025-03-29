import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { AddCustomerRequest, CustomerResponse } from '../models/customer.model';
import { CommonResponse } from '../models/lsp.model';
import { IdentityService } from './identity.service';
import { userId } from '../constants/common';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService, private identityService:IdentityService
) { }

  getCustomerList( filters: any): Observable<IApiBaseResponse<CustomerResponse[]>> {
    return this.apiHandlerService.Get('customer', filters);
  }

  getCustomerDetails(id: string,userId: string): Observable<IApiBaseResponse<CustomerResponse>> {
    return this.apiHandlerService.Get(`customer/${id}?userId=${userId}`);
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

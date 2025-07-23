import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { AddCustomerRequest, CheckCustomer, CustomerMapping, CustomerResponse } from '../models/customer.model';
import { CommonResponse, CountResponse } from '../models/lsp.model';
import { IdentityService } from './identity.service';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService, private identityService: IdentityService
  ) { }

  getCustomerList(id: string, filters: any): Observable<IApiBaseResponse<CustomerResponse[]>> {
    return this.apiHandlerService.Get(`Customer/GetCustomerList?userId=${id}`, filters);
  }

  getCustomerDetails(id: string, userId: string): Observable<IApiBaseResponse<CustomerResponse>> {
    return this.apiHandlerService.Get(`Customer/GetCustomerDetail?custId=${id}&userId=${userId}`);
  }

  addCustomer(addcustomerRequest: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customer', addcustomerRequest);
  }

  updateCustomer(id: string, addcustomerRequest: AddCustomerRequest): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('customer/' + id, addcustomerRequest);
  }

  deleteCustomer(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch(`customer/DeleteCustomer?id=${id}`, null);
  }

  checkMappingCustomer(id: string): Observable<IApiBaseResponse<CustomerMapping[]>> {
    return this.apiHandlerService.Get(`customer/DeleteCustomerData?custId=${id}`);
  }

  customerCount(): Observable<IApiBaseResponse<CountResponse[]>> {
    return this.apiHandlerService.Get(`customer/CustomerCount`);
  }

  CheckedCustomer(id: string): Observable<IApiBaseResponse<CheckCustomer[]>> {
    return this.apiHandlerService.Get(`customer/CheckCustomerData?custId=${id}`);
  }

  getCustomersData(id: string): Observable<IApiBaseResponse<CustomerResponse[]>> {
    return this.apiHandlerService.Get(`Customer/Customers?userId=${id}`);
  }

  downloadCustomerList(id:string): Observable<IApiBaseResponse<CustomerResponse[]>> {
    return this.apiHandlerService.Get(`Customer/DownloadCustomer?userId=${id}`);
  }
}

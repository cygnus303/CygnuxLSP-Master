import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse, ParamsType } from '../interfaces/api-base-action-response';
import { AddLspRequest, CommonResponse, LspMappingResponse, LspResponse } from '../models/lsp.model';


@Injectable({
  providedIn: 'root'
})
export class LspService {

  constructor(@Inject(ApiHandlerService) private apiHandlerService: ApiHandlerService) { }

  getLspList(userId:string,filters: any): Observable<IApiBaseResponse<LspResponse[]>> {
    return this.apiHandlerService.Get(`lsp/GetLSPList?userId=${userId}`, filters);
  }

  getLspDetails(id: string): Observable<IApiBaseResponse<LspResponse>> {
    return this.apiHandlerService.Get(`lsp/GetDetails?lspid=${id}`);
  }

  addLsp(addLspRequest: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('lsp/AddLsp', addLspRequest);
  }

  updateLsp(id: string, addLspRequest: any): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Post('lsp/UpdateLsp/' + id, addLspRequest);
  }

  deleteLsp(id: string): Observable<IApiBaseResponse<CommonResponse>> {
    return this.apiHandlerService.Patch(`lsp/DeleteLsp?lspid=${id}`);
  }

  checkMappinglsp(id:string): Observable<IApiBaseResponse<LspMappingResponse[]>> {
    return this.apiHandlerService.Get(`lsp/GetDeleteLSPData?lspid=${id}`);
  }
}

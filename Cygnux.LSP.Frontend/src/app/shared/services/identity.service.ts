import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { HttpHeaders } from '@angular/common/http';
import { ApiHandlerService } from './api-handler.service';
import { IApiBaseResponse } from '../interfaces/api-base-action-response';
import { ApiTokenName, Roles } from '../constants/common';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  constructor(private apiHandlerService: ApiHandlerService,
    @Inject(DOCUMENT) private _doc: Document) {

  }

  localStorage(): Storage | undefined {
    return this._doc.defaultView?.localStorage;
  }

  login(loginDetails: any): Observable<IApiBaseResponse<any>> {
    const headers = new HttpHeaders()
      .set('no-auth', 'true');
    return this.apiHandlerService.Post('Account/Login', loginDetails, undefined, headers);
  }

  setToken(token: string): void {
    this.localStorage()?.setItem(ApiTokenName, token);
  }
  setRoles(roles: string[]): void {
    this.localStorage()?.setItem(Roles,JSON.stringify(roles));
  }

  getToken(): any {
    let token = null;
    if (this.localStorage()) {
      token = this.localStorage()?.getItem(ApiTokenName);
    }
    return token;
  }

  clearToken(): void {
    this.localStorage()?.removeItem(ApiTokenName);
  }

  isAuthenticate(): boolean {
    return this.getToken() ? true : false;
  }
}

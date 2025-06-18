import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthMemoryService {
  public rememberedEmail: string = '';
  public rememberedPassword: string = '';

  constructor() { }
}

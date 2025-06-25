// auth.service.ts
import { Injectable } from '@angular/core';
import { Roles } from '../constants/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRoles: string[] = [];

  constructor(
    private router:Router
  ) {
    this.userRoles = JSON.parse(localStorage.getItem(Roles) || '[]'); // Set user's roles here
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  // Check if user has one of multiple roles
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.userRoles.includes(role));
  }

  logoutAfterTimeout(minutes: number) {
  const timeout = minutes * 60 * 1000; // Convert minutes to milliseconds
  setTimeout(() => {
   localStorage.clear();
    location.href = '/login';
  }, timeout);
}
}

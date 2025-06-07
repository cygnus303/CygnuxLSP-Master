import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginGuard } from '../../shared/guards/login.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';

export const LoginRoutes: Routes = [{
  path: '',
  component: LoginComponent,
  
  canActivate: [LoginGuard]
},
{ 
  path: 'forgot-password', component: ForgotPasswordComponent 
},
{ 
  path: 'otp-verification/:id', component: OtpVerificationComponent 
}];

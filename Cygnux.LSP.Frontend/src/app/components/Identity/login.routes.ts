import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginGuard } from '../../shared/guards/login.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { ResetPasswordEmailComponent } from './reset-password-email/reset-password-email.component';

export const LoginRoutes: Routes = [{
  path: '',
  component: LoginComponent,
  
  canActivate: [LoginGuard]
},
{ 
  path: 'ForgotPassword', component: ResetPasswordEmailComponent 
},
{ 
  path: 'changePassword/:id', component: ForgotPasswordComponent 
},
{ 
  path: 'otp-verification/:id', component: OtpVerificationComponent 
}];

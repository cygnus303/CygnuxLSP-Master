import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password-email',
  standalone: false,
  templateUrl: './reset-password-email.component.html',
  styleUrl: './reset-password-email.component.scss'
})
export class ResetPasswordEmailComponent {
 public email: string = '';
 sendOtp(){
  
 }
}

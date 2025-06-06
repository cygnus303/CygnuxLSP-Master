import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
public isPasswordVisible: boolean = false;
togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
      }
}

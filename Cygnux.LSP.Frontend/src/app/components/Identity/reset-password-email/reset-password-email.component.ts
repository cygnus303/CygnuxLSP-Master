import { Component } from '@angular/core';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-email',
  standalone: false,
  templateUrl: './reset-password-email.component.html',
  styleUrl: './reset-password-email.component.scss'
})
export class ResetPasswordEmailComponent {
 public email: string = '';
 private forgotId:string='';

constructor(
 private authenticationService:AuthenticationService,
 private toastrService:ToastrService,
 private router:Router
){}

 sendOtp() {
  const filters = {
    email: this.email
  };

  this.authenticationService.forgotPasswordMail(filters).subscribe({
    next: (response) => {
      if (response.status) {
        this.toastrService.success(response.message);
        this.forgotId= response.data.split('/').pop();
        this.router.navigate(['login', 'changePassword', this.forgotId]);
      } else {
        this.toastrService.error(response.message);
      }
    },
    error: (response) => {
      this.toastrService.error(response.message);
    }
  });
}
}

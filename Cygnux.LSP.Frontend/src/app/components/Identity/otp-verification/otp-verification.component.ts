import { Component } from '@angular/core';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp-verification',
  standalone: false,
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent {
  public email: string = '';
  public showOtp: boolean = false;
  public  otp = { d1: '', d2: '', d3: '', d4: '', d5: '', d6: '' };
  public otpId:string='';
  public failedAttempts: number = 0;
 public maxAttempts: number = 3;
 isResending: boolean = false;
 public isOtpAlreadyVerified: boolean = false;

  constructor(
      private authenticationService:AuthenticationService,
      private route: ActivatedRoute,
      private router:Router,
      private toastrService:ToastrService
  ){}

 ngOnInit(): void {
    this.otpId = this.route.snapshot.paramMap.get('id')!;
  }

  sendOtp() {
    if (this.email) {
      this.showOtp = true;
    }
  }
  moveFocus(event: any, nextInput: any) {
    if (event.target.value.length === 1) {
      nextInput.focus();
    }
  }

  backspace(event: any, prevInput: any) {
    if (!event.target.value) {
      prevInput.focus();
    }
  }

 verifyOtp() {
  const otpCode = Object.values(this.otp).join('');
  if (otpCode.length === 6) {
    const filters = {
      requestId: this.otpId,
      email: null,
      otp: otpCode
    };

    this.authenticationService.verifyOTP(filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastrService.success(response.data.message);
          this.isOtpAlreadyVerified = true;  // Mark OTP as verified
          this.router.navigateByUrl(`login/changePassword/${this.otpId}`);
        } else {
          if (response.error?.message === 'OTP already verified.') {
            this.isOtpAlreadyVerified = true;
          } else {
            this.failedAttempts++;
          }
          this.toastrService.error(response.error.message);
        }
      },
      error: (response) => {
        if (response.error?.message === 'OTP already verified.') {
          this.isOtpAlreadyVerified = true;
        } else {
          this.failedAttempts++;
        }
        this.toastrService.error(response.error.message);
      }
    });
  }
}


  resendOTP(){
    const filters={
        requestId:this.otpId,
        emailId:null,
      }
      this.isResending = true;
       this.authenticationService.resendOTP(filters).subscribe({
        next: (response) => {
          this.isResending = false;
          if(response.success){
          this.toastrService.success(response.data.message);
          }else{
            this.toastrService.error(response.error.message)
          }
        },
        error: (response) => {
          this.isResending = false;
          this.toastrService.error(response.error.message)
        }
      });
  }
}

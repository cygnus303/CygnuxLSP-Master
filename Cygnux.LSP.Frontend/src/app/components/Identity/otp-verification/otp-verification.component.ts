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
 public loginErrorMessage: string = '';
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
         this.loginErrorMessage='';
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
          // this.toastrService.error(response.error.message);
           this.loginErrorMessage = response.error.message;
        }
      },
      error: (response) => {
        if (response.error?.message === 'OTP already verified.') {
          this.isOtpAlreadyVerified = true;
        } else {
          this.failedAttempts++;
        }
        // this.toastrService.error(response.error.message);
        this.loginErrorMessage = response.error.message;
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
           this.loginErrorMessage='';
          this.isResending = false;
          if(response.success){
            this.otp = { d1: '', d2: '', d3: '', d4: '', d5: '', d6: '' };
            this.isOtpAlreadyVerified = true;
            this.toastrService.success(response.data.message);
          }else{
            // this.toastrService.error(response.error.message)
             this.loginErrorMessage = response.error.message;
          }
        },
        error: (response) => {
          this.isResending = false;
          // this.toastrService.error(response.error.message)
           this.loginErrorMessage = response.error.message;
        }
      });
  }

  handlePaste(event: ClipboardEvent): void {
  const pastedText = event.clipboardData?.getData('text') || '';
  const otpChars = pastedText.trim().slice(0, 6).split('');

  if (otpChars.length === 6 && otpChars.every(c => /^[0-9]$/.test(c))) {
    this.otp = {
      d1: otpChars[0],
      d2: otpChars[1],
      d3: otpChars[2],
      d4: otpChars[3],
      d5: otpChars[4],
      d6: otpChars[5]
    };
    setTimeout(() => this.verifyOtp(), 100);
  }
  event.preventDefault(); 
}

}

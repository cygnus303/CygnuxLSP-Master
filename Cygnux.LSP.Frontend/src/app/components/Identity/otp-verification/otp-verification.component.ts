import { Component } from '@angular/core';

@Component({
  selector: 'app-otp-verification',
  standalone: false,
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent {
  email: string = '';
  showOtp: boolean = false;
  sendOtp() {
    if (this.email) {
      this.showOtp = true;
    }
  }
  otp = { d1: '', d2: '', d3: '', d4: '', d5: '', d6: '' };
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
      console.log('Entered OTP:', otpCode);

      // this.http.post('your-api-endpoint', { email: this.email, otp: otpCode }).subscribe({
      //   next: (res) => {
      //     console.log('OTP verified successfully', res);
      //   },
      //   error: (err) => {
      //     console.error('Invalid OTP', err);
      //   }
      // });
    }
  }
}

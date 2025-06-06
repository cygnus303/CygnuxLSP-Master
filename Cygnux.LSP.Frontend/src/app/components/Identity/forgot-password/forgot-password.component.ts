import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  passwordForm!: FormGroup;
  isPasswordVisible = false;
  isConfirmVisible = false;
constructor() {
  this.passwordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
    ]),
    confirmPassword: new FormControl('')
  }, { validators: this.passwordMatchValidator }); // ✅ corrected here
}


 passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmVisibility() {
    this.isConfirmVisible = !this.isConfirmVisible;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      console.log('New password:', this.passwordForm.value.newPassword);
      // send to API
    }
  }
}

import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  public passwordForm!: FormGroup;
  public isPasswordVisible = false;
  public isConfirmVisible = false;
  public id:string='';
  public isSubmitting: boolean = false;
 public loginErrorMessage: string = '';
  constructor(
    private authenticationService:AuthenticationService,
    private toastrServiceo:ToastrService,
    private route:ActivatedRoute,
    private router:Router
  ) {
  }

   ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.buildForm();
  }

  buildForm(){
  this.passwordForm = new FormGroup({
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
        ]),
        confirmPassword: new FormControl('')
      }, { validators: this.passwordMatchValidator });
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
      this.isSubmitting = true;
    if (this.passwordForm.valid) {
      const filters={
        requestId:this.id,
        newPassword: this.passwordForm.get('newPassword')?.value,
      }
      this.authenticationService.resetPassword(filters).subscribe({
      next: (response) => {
        this.loginErrorMessage='';
        if (response) {
        this.isSubmitting = false;
        this.toastrServiceo.success(response.data.message);
        this.router.navigateByUrl('/login');
        }
      },
      error: (response: any) => {
        this.isSubmitting = false;
        // this.toastrServiceo.error(response.error.message);
        this.loginErrorMessage = response.error.message;
      },
    });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityService } from '../../shared/services/identity.service';
import { EmailRegex, MobileRegex, PasswordRegex } from '../../shared/constants/common';
import { CommonService } from '../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    public loginFormGroup!: FormGroup;
    public loading = false;
    public isFormSubmit = false;
    public isPasswordVisible: boolean = false;
    public showLogin = true;
    public showForgotPassword = false;
    public sendEmail=false;
    
    constructor(private identityService: IdentityService,
        private commonService: CommonService,
        private toasterService: ToastrService,
        private router: Router) {

    }

    ngOnInit(): void {
        this.buildLoginForm();
    }

    buildLoginForm(): void {
        this.loginFormGroup = new FormGroup({
            password: new FormControl(null, [Validators.required, Validators.pattern(PasswordRegex), Validators.minLength(8)]),
            email: new FormControl(null, [Validators.required, Validators.pattern(EmailRegex)])
        });
    }

    get loginControls(): { [key: string]: AbstractControl } {
        let loginDetail = this.loginFormGroup.controls;
        return loginDetail;
    }

    public onSubmitLogin(): void {
        if (this.loginFormGroup.invalid) {
            return;
        }
        this.commonService.updateLoader(true);
        this.identityService.login(this.loginFormGroup.getRawValue())
            .subscribe({
                next: (response) => {
                    if (response && response.success) {
                        this.toasterService.success('Login Successfully.');
                        this.identityService.setToken(response.data.token);
                        this.identityService.setRoles(response.data.roles);
                        this.router.navigateByUrl('/dashboard');
                        this.identityService.getLoggedUserId()
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('roleId', response.data.roleId);
                    } else {
                        if (response.error) {
                            this.toasterService.error(response.error.message);
                            this.commonService.updateLoader(false);
                        }
                    }
                },
                error: (response: any) => {
                    this.commonService.updateLoader(false);
                    this.toasterService.error(response.error.message);
                },
            });
    }

    public onShowLogin(): void {
        this.buildLoginForm();
        this.isFormSubmit = false;
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
      }

      openForgotPassword() {
        this.showLogin = false;
        this.showForgotPassword = true;
        this.sendEmail =false;
      }
      backToLogin() {
        this.showForgotPassword = false;
        this.showLogin = true;
        this.sendEmail =false;
      }
      sendToEmail(){
        this.sendEmail =true;  //It store value in api response
      }

      resetPassword(){
        
      }
}

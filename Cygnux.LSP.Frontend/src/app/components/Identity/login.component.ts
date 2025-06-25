import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityService } from '../../shared/services/identity.service';
import { EmailRegex, PasswordRegex } from '../../shared/constants/common';
import { CommonService } from '../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AuthMemoryService } from '../../shared/services/authmemory.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    public loginFormGroup!: FormGroup;
    public loading :boolean = false;
    public isPasswordVisible: boolean = false;

    constructor(private identityService: IdentityService,
        private commonService: CommonService,
        private toasterService: ToastrService,
        private router: Router,
        private authMemory: AuthMemoryService,
        private authService:AuthService
    ) {

    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.loginFormGroup = new FormGroup({
            password: new FormControl(null, [Validators.required, Validators.pattern(PasswordRegex), Validators.minLength(8)]),
            email: new FormControl(null, [Validators.required, Validators.pattern(EmailRegex)]),
            rememberMe: new FormControl(false)
        });
        if (this.authMemory.rememberedEmail) {
            this.loginFormGroup.patchValue({
                email: this.authMemory.rememberedEmail,
                password: this.authMemory.rememberedPassword,
                rememberMe: true
            });
        }
    }

     onSubmitLogin() {
        if (this.loginFormGroup.invalid) return;

        const { email, password, rememberMe } = this.loginFormGroup.value;

        if (rememberMe) {
            this.authMemory.rememberedEmail = email;
            this.authMemory.rememberedPassword = password
        } else {
            this.authMemory.rememberedEmail = '';
            this.authMemory.rememberedPassword = ''
        }
        this.loading = true;
        this.commonService.updateLoader(true);

        this.identityService.login(this.loginFormGroup.getRawValue())
            .subscribe({
                next: (response) => {
                    this.loading = false; // hide button loader
                    this.commonService.updateLoader(false); // optional

                    if (response && response.success) {
                        this.identityService.setToken(response.data.token);
                        this.identityService.setRoles(response.data.roles);
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('roleId', response.data.roleId);
                        this.router.navigateByUrl('/dashboard');
                        this.toasterService.success('Login Successfully.');
                        this.authService.logoutAfterTimeout(30);
                    } else {
                        if (response.error) {
                            this.toasterService.error(response.error.message);
                        }
                    }
                },
                error: (response: any) => {
                    this.loading = false;
                    this.commonService.updateLoader(false);
                    this.toasterService.error(response.error.message);
                },
            });
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

}

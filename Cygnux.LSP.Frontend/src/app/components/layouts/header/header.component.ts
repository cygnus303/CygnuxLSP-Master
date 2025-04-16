import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
import { CommonService } from '../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { ChangePasswordComponent } from '../../change-password/change-password.component';
// import feather from 'feather-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnDestroy{
  email = localStorage.getItem('email');
  headerMenu:string='';
  activeNavigationUrlSubscription!:Subscription;
  userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  @ViewChild('changePassword') changePassword!: ChangePasswordComponent;
  
  constructor(private identityService: IdentityService,
    public router: Router,public commonService:CommonService) {
      this.activeNavigationUrlSubscription = this.commonService.activeNavigationUrl.subscribe((res)=>{
        this.headerMenu = res
      });
  }
  ngOnDestroy(): void {
    if(this.activeNavigationUrlSubscription){this.activeNavigationUrlSubscription.unsubscribe()}
  }

  // ngAfterViewInit() {
  //   feather.replace(); // Ensure icons render
  // }
 
  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }


  OnChangePassword(){
    this.changePassword?.showpopup();
  }
  
}

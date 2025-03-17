import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
// import feather from 'feather-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent {

  constructor(private identityService: IdentityService,
    private router: Router) {

  }

  // ngAfterViewInit() {
  //   feather.replace(); // Ensure icons render
  // }
 
  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
  
}

import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
import { MenuService } from '../../../shared/services/menu.service';
import { CommonService } from '../../../shared/services/common.service';
import { MenuResponse } from '../../../shared/models/menu.model';
import { CommonModule } from '@angular/common';
import feather from 'feather-icons';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

declare global {
  interface Window {
    toggleSidebarMenu: () => void;
  }
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: []
})
export class SidebarComponent implements OnInit {
  public iscollapse:boolean=false;
  public menus: MenuResponse[] = [];
  public getlogoImages:string ='';
  constructor(private identityService: IdentityService,
    private router: Router,
    private toasterService: ToastrService,
    public commonService: CommonService,
    private menuService: MenuService,private scriptLoader: ScriptLoaderService) {

  }
ngOnInit(): void {
  this.userRoleWithLogo();
  this.scriptLoader
  .loadScript('assets/js/sidebar-menu.js')
  .then(() => {})
  .catch((error) => console.error(error)); 
  setTimeout(() => {
  this.getMenus();

}, 300);
}

toggleSidebar(){
  if (window.toggleSidebarMenu) {
    window.toggleSidebarMenu();
  } else {
    console.error("sidebar-menu.js is not loaded or function not found");
  }
}
onLogoError(event: any) {
  event.target.src = 'assets/images/logo/logo.png';
}

getMenus() {
  this.commonService.updateLoader(true);
  this.menuService.getMenuList()
  .subscribe({
    next: (response) => {
      if (response) {
        this.menus = response.data;
        this.menuService.setMenusToCache(this.menus);
        const urlPart = this.router.url === '/docket/list' ? '/' + this.router.url.split('/')[1] : this.router.url;
        const data = this.menus.find(res => res.navigationUrl.includes(urlPart));
        if (data) {
          this.commonService.activemenuRoleList.next(data);
        }
      }
      this.commonService.updateLoader(false);
      setTimeout(() => {
        feather.replace();
      }, 0);
    },
    error: (response: any) => {
      this.toasterService.error(response.error.message);
      this.commonService.updateLoader(false);
    },
  });
}

userRoleWithLogo(){
  this.menuService.UserRoleWithLogo(this.identityService.getLoggedUserId()).subscribe({next: (response) => {
        if (response) {
         const baseUrl = 'https://uatlspapi.cygnux.in/';
          if (response.data.logoLink) {
            const logo = response.data.logoLink.replace(/\\/g, '/');
            this.getlogoImages = logo.startsWith('http') ? logo : baseUrl + logo;
          } else {
            this.getlogoImages = 'assets/images/logo/logo.png'; // fallback
          }
        }
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
      },
    });
}

onSidebar(data:any){
  this.commonService.activemenuRoleList.next(data)
}

  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
}

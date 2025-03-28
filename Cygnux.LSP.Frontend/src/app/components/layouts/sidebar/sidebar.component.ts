import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
import { MenuService } from '../../../shared/services/menu.service';
import { CommonService } from '../../../shared/services/common.service';
import { MenuResponse } from '../../../shared/models/menu.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import feather from 'feather-icons';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';
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
  iscollapse:boolean=false;
  public menus: MenuResponse[] = [];
  constructor(private identityService: IdentityService,
    private router: Router,
    private toasterService: ToastrService,
    public commonService: CommonService,
    private menuService: MenuService,private scriptLoader: ScriptLoaderService) {

  }
ngOnInit(): void {
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

getMenus() {
  this.commonService.updateLoader(true);
  this.menuService.getMenuList()
  .subscribe({
    next: (response) => {
      if (response) {
        this.menus = response.data;
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

  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
}

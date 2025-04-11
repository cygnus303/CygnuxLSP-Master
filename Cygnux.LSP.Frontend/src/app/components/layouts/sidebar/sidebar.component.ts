import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
import { MenuService } from '../../../shared/services/menu.service';
import { CommonService } from '../../../shared/services/common.service';
import { MenuResponse } from '../../../shared/models/menu.model';
import { CommonModule } from '@angular/common';
import feather from 'feather-icons';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';
import { RolePermissionService } from '../../../shared/services/role-permission.service';
import { RolePermissionResponse } from '../../../shared/models/role-permission.model';
import { ToastrService } from 'ngx-toastr';
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
  private rolePermission:RolePermissionResponse[] = [];
  constructor(private identityService: IdentityService,
    private router: Router,
    private toasterService: ToastrService,
    public commonService: CommonService,
    private menuService: MenuService,private scriptLoader: ScriptLoaderService,private rolePermissionService:RolePermissionService) {

  }
ngOnInit(): void {
  this.scriptLoader
  .loadScript('assets/js/sidebar-menu.js')
  .then(() => {})
  .catch((error) => console.error(error)); 
  setTimeout(() => {
  // this.getRolePermission();
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
  debugger
  this.menuService.getMenuList()
  .subscribe({
    next: (response) => {
      if (response) {
        this.menus = response.data
        // map((menu: any) => {
        //   const permission = this.rolePermission.find(p => p.menuId === menu.menuId);
        //   return {
        //     ...menu,
        //     canView: permission ? permission.canView : false,
        //     canEdit: permission ? permission.canEdit : false,
        //     canDelete: permission ? permission.canDelete : false,
        //     canCreate: permission ? permission.canCreate : false
        //   };
        // });
        const data = this.menus.find(res => res.navigationUrl.includes(this.router.url));
        if (data) {
          console.log("Updating Subject with:", data);
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


onSidebar(data:any){
  this.commonService.activemenuRoleList.next(data)
}

// getRolePermission() {
//   const roleId = localStorage.getItem('roleId') || '';
//   this.commonService.updateLoader(true);
//   this.rolePermissionService.getRolePermissionByRole(roleId).subscribe({
//       next: (response) => {
//           if (response) {
//               this.rolePermission = response.data;
//           }
//           this.commonService.updateLoader(false);
//       },
//       error: (response: any) => {
//           this.toasterService.error(response.error.message);
//           this.commonService.updateLoader(false);
//       },
//   });
// }

  signout(): void {
    this.identityService.clearToken();
    this.router.navigateByUrl('/login');
  }
}

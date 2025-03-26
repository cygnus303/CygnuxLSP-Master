import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../shared/services/identity.service';
import { MenuService } from '../../../shared/services/menu.service';
import { CommonService } from '../../../shared/services/common.service';
import { MenuResponse } from '../../../shared/models/menu.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import feather from 'feather-icons';

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
    private menuService: MenuService,) {

  }

  menuss = [
    {
        "menuId": "32ff7828-44d7-4cdd-a10e-3e72832a7ca1",
        "menuName": "Lsp Mapping",
        "navigationUrl": "./lsp-mapping",
        "isActive": false,
        "icon": "truck"
    },
    {
        "menuId": "59fc7f56-be9a-466f-9d4b-480caec37689",
        "menuName": "User",
        "navigationUrl": "./user",
        "isActive": false,
        "icon": "users"
    },
    {
        "menuId": "c294c780-e285-4d3a-a74b-6cbf6e57e45c",
        "menuName": "Role",
        "navigationUrl": "./role",
        "isActive": false,
        "icon": "users"
    },
    {
        "menuId": "2d88fb80-db9c-4a5f-8f97-c2751cbe7fc4",
        "menuName": "Lsp Tat",
        "navigationUrl": "./lsp-tat",
        "isActive": false,
        "icon": "truck"
    },
    {
        "menuId": "a64e573a-2873-4c9d-b419-c81cd4c2a8ba",
        "menuName": "Customer",
        "navigationUrl": "./customer/list",
        "isActive": false,
        "icon": "users"
    },
    {
        "menuId": "d2686dac-a194-4825-b8d9-e6f8183ae570",
        "menuName": "Role",
        "navigationUrl": "./role",
        "isActive": false,
        "icon": "users"
    },
    {
        "menuId": "bac41e6a-83b5-479d-85f2-f5be01ef4c57",
        "menuName": "Docket",
        "navigationUrl": "./docket",
        "isActive": false,
        "icon": "truck"
    },
    {
        "menuId": "47a48b94-4da4-4b40-a20e-fa5c5e7a1834",
        "menuName": "Lsp",
        "navigationUrl": "./lsp",
        "isActive": false,
        "icon": "truck"
    }
]

  ngOnInit(): void {
    this.getMenus();
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

  sidebarClosed: boolean = false;

  toggleSidebar() {
    this.sidebarClosed = !this.sidebarClosed;
    const sidebar = document.querySelector('.sidebar-wrapper');
    const header = document.querySelector('.page-header');

    if (this.sidebarClosed) {
      sidebar?.classList.add('close_icon');
      header?.classList.add('close_icon');
    } else {
      sidebar?.classList.remove('close_icon');
      header?.classList.remove('close_icon');
    }
  }

  togglePin(menuName: string) {
    let pinnedItems = JSON.parse(localStorage.getItem('pins') || '[]');

    if (pinnedItems.includes(menuName)) {
      pinnedItems = pinnedItems.filter((item: string) => item !== menuName);
    } else {
      pinnedItems.push(menuName);
    }

    localStorage.setItem('pins', JSON.stringify(pinnedItems));
  }

  scrollLeft() {
    const sidebar = document.getElementById('sidebar-menu');
    if (sidebar) {
      sidebar.scrollLeft -= 200;
    }
  }

  scrollRight() {
    const sidebar = document.getElementById('sidebar-menu');
    if (sidebar) {
      sidebar.scrollLeft += 200;
    }
  }
}

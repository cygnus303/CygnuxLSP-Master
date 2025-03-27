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

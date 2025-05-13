import { Component, AfterViewInit } from '@angular/core';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import feather from 'feather-icons';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-docket-layout',
  templateUrl: './docket-layout.component.html',
  styleUrl: './docket-layout.component.scss'
})
export class DocketLayoutComponent implements AfterViewInit {
    public RoleListsubscribe!:Subscription;
  
  constructor(public commonService:CommonService) {
    defineElement(lottie.loadAnimation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(){
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
    this.RoleListsubscribe = this.commonService.activemenuRoleList.subscribe((res)=>{
      if (res) { 
        this.commonService.menuRoleList = res;
      }
     });
  }

  ngAfterViewInit() {
    feather.replace();
  }
}

import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { LspService } from '../../../shared/services/lsp.service';
import { CommonService } from '../../../shared/services/common.service';
import { LspResponse } from '../../../shared/models/lsp.model';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import { environment } from '../../../../environments/environment';
import { defineElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import { IdentityService } from '../../../shared/services/identity.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lsp',
  standalone: false,
  templateUrl: './lsp-list.component.html',
  styleUrls: ['./lsp-list.component.scss'],
})
export class LspListComponent implements OnInit {
  public lspId: string = '';
  public lsps: LspResponse[] = [];
  selectedLsp: LspResponse | null = null;
  page = 1; // Current page number
  pageSize = 5; // Number of items per page
  totalItems = 0; // Total number of items
  @Output() edit = new EventEmitter<LspResponse>();
  filters: { [key: string]: string } = {}; // Dynamic filter object
  RoleListsubscribe!:Subscription;
  constructor(
    private lspService: LspService,
    public commonService: CommonService,
    private toasterService: ToastrService,
    private identityService:IdentityService,
    private route: ActivatedRoute
  ) {defineElement(lottie.loadAnimation);
    this.commonService.activeNavigationUrl.next('Lsp');
  }

  ngOnInit(): void {
    this.getLsps();
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
    this.RoleListsubscribe= this.commonService.activemenuRoleList.subscribe((res)=>{
      if (res) { 
        this.commonService.menuRoleList = res;
        console.log("Updated from activemenuRoleList:", res);
      }
     });
    // this.route.paramMap.subscribe(params => {
    //   const navigationState = history.state;
    //   if (navigationState && navigationState.start) {
    //     this.commonService.menuRoleList = navigationState.start;
    //     console.log(this.commonService.menuRoleList)
    //   }
    // });
  }

  ngOnDestroy(): void {
    if(this.RoleListsubscribe){this.RoleListsubscribe.unsubscribe()}
  }

  getLsps(page: number = 1) {
    this.filters = Object.fromEntries(
      Object.entries(this.filters).filter(([key, value]) => value !== null)
    );
    this.commonService.updateLoader(true);
    const filters: any = {
      ...this.filters,
      Page: page,
      PageSize: this.pageSize,
      UserID:this.identityService.getLoggedUserId(),
    };
    this.lspService.getLspList(filters).subscribe({
      next: (response) => {
        if (response) {
          this.lsps = response.data;
          this.totalItems = response.totalCount;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  deleteLsp() {
    this.commonService.updateLoader(true);
    this.lspService.deleteLsp(this.lspId).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
        this.closeDeleteModal();
        this.getLsps();
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  editModal(event: Event, id: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getLsp(id);
    }
  }
  deleteModal(event: Event, id: string) {
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      this.lspId = id;
      modal.show();
    }
  }
  getLsp(id: string) {
    this.commonService.updateLoader(true);
    this.lspService.getLspDetails(id).subscribe({
      next: (response) => {
        if (response) {
          this.selectedLsp = response.data;
          this.selectedLsp.logo =
            environment.apiUrl.replace('/api/v1', '') +
            this.selectedLsp.logo.replace(/\\/g, '/');
          this.edit.emit(response.data);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
  closeDeleteModal() {
    const modalElement: any = document.getElementById('deleteModal');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
    }
  }
  closeEditModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    const modalInstance = Modal.getInstance(modalElement); // Get the modal instance
    if (modalInstance) {
      modalInstance.hide(); // Hide the modal
      this.getLsps();
    }
  }
  openModal() {
    const modalElement: any = document.getElementById('exampleModalLong');
    if (modalElement) {
      const modal = new Modal(modalElement); // Using Bootstrap's JS modal method
      this.lspId = '';
      this.selectedLsp = null;
      modal.show();
    }
  }
  onPageChange(page: number) {
    this.page = page;
    this.getLsps(this.page);
  }

  lspDetail(event: Event, lspId: string){
    event.preventDefault(); // Prevent default anchor behavior
    const modalElement = document.getElementById('lspDetail');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
      this.getLsp(lspId);
    }
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../shared/services/role.service';
import { RoleResponse } from '../../../shared/models/role.model';
import { SweetAlertService } from '../../../shared/services/toastr.service';

@Component({
  selector: 'app-add-role',
  standalone: false,
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit, OnChanges {
  public roleForm!: FormGroup;
  public roleId: string = '';
  public isLoading = false;
  @Input() roleResponse: RoleResponse | null = null;
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();

  constructor(
    private roleService: RoleService,
    private sweetAlertService: SweetAlertService
  ) {
    this.roleForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.roleForm = new FormGroup({
      roleName: new FormControl(null, [Validators.required]),
      isActive: new FormControl(true),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['roleResponse'] && this.roleResponse) {
      this.roleForm.patchValue(this.roleResponse);
      this.roleId = this.roleResponse.id;
    } else {
      this.roleForm.reset();
      this.roleId = '';
    }
  }

  onClose(){
      this.buildForm();
  }

  onSubmitRole(form: FormGroup): void {
    if (form.valid) {
      this.isLoading = true;
      !this.roleId ? this.addRole(form) : this.updateRole(form);
    }
    this.isLoading = false;
  }

  addRole(form: FormGroup): void {
    this.roleService.addRole(form.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.roleForm.reset();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.isLoading = false;
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  updateRole(form: FormGroup): void {
    this.roleService.updateRole(this.roleId, form.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.roleForm.reset();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.isLoading = false;
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  isActiveChecked(event: any) {
    const isChecked = event.target.checked;
    const roleId = this.roleId;

    if (!roleId) return;

    if (!isChecked) {
      this.roleService.checkRoleData(roleId).subscribe({
        next: (response) => {
          if(response.data.message){
             this.sweetAlertService.info(response.data.message);
            this.roleForm.get('isActive')?.setValue(true, { emitEvent: false });
          }
        },
        error: (error) => {
          this.sweetAlertService.error(error?.message || 'Something went wrong while checking mapping.');
        }
      });
    } 
  }
}

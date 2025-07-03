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
import { LspService } from '../../../shared/services/lsp.service';
import { EmailRegex, MobileRegex, OnlyDigitRegex } from '../../../shared/constants/common';
import { LspResponse } from '../../../shared/models/lsp.model';
import { IdentityService } from '../../../shared/services/identity.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';
import { UserService } from '../../../shared/services/user.service';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
  selector: 'app-add-lsp',
  standalone: false,
  templateUrl: './add-lsp.component.html',
  styleUrls: ['./add-lsp.component.scss'],
})
export class AddLspComponent implements OnInit, OnChanges {
  public lspForm!: FormGroup;
  public lspId: string = '';
  public selectedFile: File | null = null;
  public fileError: string | null = null;
  public imagePreview: string | null = null; 
  public selectedFileName :string = '';
  public userId :string | null = null;
  public tempFormData!:FormData;
  @Input() lspResponse: LspResponse | null = null;
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();

  constructor(
    private lspService: LspService,
    private identityService:IdentityService,
    private sweetAlertService:SweetAlertService,
    private userService:UserService,
    private authenticationService:AuthenticationService
  ) {
    this.lspForm = new FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lspResponse'] && this.lspResponse) {
     const urlParts = this.lspResponse.logo.split('\\');
     this.selectedFileName = urlParts[urlParts.length - 1]
      this.imagePreview = environment.apiUrl.replace('/api/v1', '') + this.lspResponse.logo.replace(/\\/g, '/');
      this.lspId = this.lspResponse.lspId;
      this.lspForm.patchValue(this.lspResponse);
    } else {
      this.lspForm.reset();
      this.lspId = '';
      this.selectedFileName='';
      this.imagePreview = null;
      this.buildForm();
    }
  }

  onClose(){
    // this.dataEmitter.emit();
    this.buildForm();
    this.selectedFileName='';
    this.imagePreview = null;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.lspForm = new FormGroup({
      lspName: new FormControl(null, [Validators.required]),
      mobileNo: new FormControl(null, [
        Validators.required,
        Validators.pattern(MobileRegex),
      ]),
      emailId: new FormControl(null, [
        Validators.required,
        Validators.pattern(EmailRegex),
      ]),
      alias: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      apiKey: new FormControl(''),
      apiUrl: new FormControl(''),
      apiUsername: new FormControl(''),
      apiPassword: new FormControl(''),
      logo: new FormControl('',[Validators.required]),
      isActive: new FormControl(true),
      file:new FormControl(null),
      EntryBy:new FormControl(this.identityService.getLoggedUserId()),
      roles:new FormControl('lsp Admin'),
      city:new FormControl('',[Validators.required]),
      zipCode:new FormControl('', [Validators.required,Validators.pattern(OnlyDigitRegex)]),
      address:new FormControl('',[Validators.required]),
      userType:new FormControl('L')
    });
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (validImageTypes.includes(file.type)) {
        this.selectedFile = file;
        this.fileError = null;
        this.selectedFileName = file.name
        this.lspForm.get('logo')?.setValue(file.name);

        this.lspForm.get('file')?.markAsTouched();
  
        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.fileError = 'Please upload a valid image file (JPEG, PNG, or GIF).';
        this.selectedFile = null;
        this.imagePreview = null;
        this.lspForm.patchValue({ file: null });
      }
    }
  }

  onSubmitLsp(form: FormGroup): void {
  if (form.valid) {
    const formValues = form.getRawValue();

    const jsonPayload: any = {};
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key) && key !== 'file') {
        jsonPayload[key] = formValues[key];
      }
    }

    jsonPayload['firstName'] = formValues['lspName'];

    const formData = new FormData();
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key) && key !== 'file') {
        formData.append(key, formValues[key]);
      }
    }
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    formData.append('firstName', formValues['lspName']);

    this.tempFormData = formData;

    !this.lspId ? this.addUser(jsonPayload) : this.updateLsp(formData);
  } else {
    form.markAllAsTouched();
  }
}


 addUser(jsonPayload: any) {
        const { alias, apiKey, apiPassword, apiUrl, mobileNo,
              apiUsername, description, EntryBy, logo, ...payload } = jsonPayload;
              payload.phoneNumber = mobileNo
  this.userService.addUser(this.identityService.getLoggedUserId(),payload).subscribe({
    next: (response) => {
      if (response.success) {
        // this.dataEmitter.emit();
        this.userId = response.data.id;
        this.addLsp(this.tempFormData);
        this.sendUsermail(response.data.id)
      } else {
        this.sweetAlertService.error(response.error.message);
      }
    },
    error: (response: any) => {
      this.sweetAlertService.error(response.error.message);
    },
  });
}

 sendUsermail(id:any){
    const filters={
      userId : id
    }
    this.authenticationService.sendOTPMail(this.identityService.getLoggedUserId(),filters).subscribe({
      next: (response) => {
        if (response.success) {
          // this.sweetAlertService.success(response.data.message);
        } else {
          // this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        // this.sweetAlertService.error(response.error.message);
      },
    });
  }

  addLsp(formData: any): void {
    formData.append('u_Id',this.userId)
    this.lspService.addLsp(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspForm.reset();
          this.onClose();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

  updateLsp(formData: any): void {
    this.lspService.updateLsp(this.lspId, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspForm.reset();
          this.buildForm();
          this.selectedFileName='';
         this.imagePreview = null;
        } else {
          this.sweetAlertService.error(response.error.message);
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }

getCheckboxLSP(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) return;
  this.lspService.checkMappinglsp(this.lspId).subscribe({
    next: (response) => {
      const data = response?.data;
      if (data?.status === false && data?.customerMappings?.length === 0 && data?.tatDetails?.length === 0) {  
        return;
      }
      if (data?.customerMappings?.length !== 0 && data?.tatDetails?.length !== 0) {
        this.sweetAlertService.info('This LSP is currently mapped & LSPTat. Please deactivate the mapping & LSPTat before deactivating the LSP.');
        this.lspForm.get('isActive')?.setValue(true);
      } else if (data?.customerMappings?.length !== 0 ) {
        this.sweetAlertService.info('This LSP is currently mapped. Please deactivate the mapping before deactivating the LSP.');
        this.lspForm.get('isActive')?.setValue(true);
      }else if (data?.tatDetails?.length !== 0) {
        this.sweetAlertService.info('This LSP is currently LSPTat. Please deactivate the LSPTat before deactivating the LSP.');
        this.lspForm.get('isActive')?.setValue(true);
      }
    },
    error: (error: any) => {
      this.sweetAlertService.error(error?.error?.message || 'Something went wrong');
    }
  });
}
}

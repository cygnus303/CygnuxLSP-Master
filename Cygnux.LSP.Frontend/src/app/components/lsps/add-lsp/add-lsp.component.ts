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
import { CommonService } from '../../../shared/services/common.service';
import { EmailRegex, MobileRegex } from '../../../shared/constants/common';
import { LspResponse } from '../../../shared/models/lsp.model';
import { CustomerResponse } from '../../../shared/models/customer.model';
import { IdentityService } from '../../../shared/services/identity.service';
import { SweetAlertService } from '../../../shared/services/toastr.service';


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
  public fileError: string | null = null; // For error handling
  public imagePreview: string | null = null; // For image preview
  @Input() lspResponse: LspResponse | null = null;
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();

  constructor(
    private lspService: LspService,
    private commonService: CommonService,
    private identityService:IdentityService,
    private sweetAlertService:SweetAlertService
  ) {
    this.lspForm = new FormGroup({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lspResponse'] && this.lspResponse) {
      this.lspForm.patchValue(this.lspResponse);
      this.lspId = this.lspResponse.lspId;
    } else {
      this.lspForm.reset();
      this.lspId = '';
      this.buildForm();
    }
  }

  onClose(){
    this.lspForm.reset();
    this.dataEmitter.emit();
    this.buildForm();
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
      apiKey: new FormControl(null),
      apiUrl: new FormControl(null),
      apiUsername: new FormControl(null),
      apiPassword: new FormControl(null),
      logo: new FormControl(null),
      isActive: new FormControl(true),
      file:new FormControl(null,[Validators.required]),
      EntryBy:new FormControl(this.identityService.getLoggedUserId())
    });
  }

  // Handle file input change
  onFileChange(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (validImageTypes.includes(file.type)) {
        this.selectedFile = file;
        this.fileError = null;
  
        this.lspForm.patchValue({
          file: file
        });
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
      const formData = new FormData();
  
      // Append all form fields except 'file'
      const formValues = form.getRawValue();
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key !== 'file') {
          formData.append(key, formValues[key]);
        }
      }
      if (formValues.file) {
        formData.append('file', formValues.file);
      }
  
      !this.lspId ? this.addLsp(formData) : this.updateLsp(formData);
    } else {
      form.markAllAsTouched(); // Ensures all validation messages show up
    }
  }

  addLsp(formData: any): void {
    this.commonService.updateLoader(true);
    this.lspService.addLsp(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspForm.reset();
          this.buildForm();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  updateLsp(formData: any): void {
    this.commonService.updateLoader(true);
    this.lspService.updateLsp(this.lspId, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.sweetAlertService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspForm.reset();
          this.buildForm();
        } else {
          this.sweetAlertService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
}

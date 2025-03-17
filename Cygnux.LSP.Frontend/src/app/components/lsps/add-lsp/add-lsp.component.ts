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
import { ToastrService } from 'ngx-toastr';
import { CustomerResponse } from '../../../shared/models/customer.model';

@Component({
  selector: 'app-add-lsp',
  standalone: false,
  templateUrl: './add-lsp.component.html',
  styleUrls: ['./add-lsp.component.scss'],
})
export class AddLspComponent implements OnInit, OnChanges {
  public lspForm!: FormGroup;
  public lspId: string = '';
  @Input() lspResponse: LspResponse | null = null;
  @Output() dataEmitter: EventEmitter<void> = new EventEmitter();
  selectedFile: File | null = null;
  fileError: string | null = null; // For error handling
  imagePreview: string | null = null; // For image preview

  constructor(
    private lspService: LspService,
    private commonService: CommonService,
    private toasterService: ToastrService
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
    }
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
    });
  }
  // Handle file input change
  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/jpg',
      ];
      if (validImageTypes.includes(file.type)) {
        this.selectedFile = file;
        this.fileError = null;

        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string; // Set the base64 string for preview
        };
        reader.readAsDataURL(file);
      } else {
        this.fileError =
          'Please upload a valid image file (JPEG, PNG, or GIF).';
        this.selectedFile = null;
        this.imagePreview = null; // Clear preview if invalid file
      }
    }
  }

  onSubmitLsp(form: FormGroup): void {
    if (form.valid) {
      const formData = new FormData();

      // Append all form fields using getRawValue()
      const formValues = form.getRawValue();
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          formData.append(key, formValues[key]);
        }
      }

      // Append file if selected
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
      !this.lspId ? this.addLsp(formData) : this.updateLsp(formData);
    }
  }

  addLsp(formData: any): void {
    this.commonService.updateLoader(true);
    this.lspService.addLsp(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspForm.reset();
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  updateLsp(formData: any): void {
    this.commonService.updateLoader(true);
    this.lspService.updateLsp(this.lspId, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toasterService.success(response.data.message);
          this.dataEmitter.emit();
          this.lspForm.reset();
        } else {
          this.toasterService.error(response.error.message);
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }
}

import { Component, Input } from '@angular/core';
import { LspMappingResponse } from '../../../shared/models/lsp-mapping.model';

@Component({
  selector: 'app-lsp-mappings-detail',
  standalone: false,
  templateUrl: './lsp-mappings-detail.component.html',
  styleUrl: './lsp-mappings-detail.component.scss'
})
export class LspMappingsDetailComponent {
  @Input() lspMappingsDetail: LspMappingResponse | null = null;
}

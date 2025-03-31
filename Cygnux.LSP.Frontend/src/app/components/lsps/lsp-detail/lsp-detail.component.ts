import { Component, Input } from '@angular/core';
import { LspResponse } from '../../../shared/models/lsp.model';

@Component({
  selector: 'lsp-detail',
  standalone: false,
  templateUrl: './lsp-detail.component.html',
  styleUrl: './lsp-detail.component.scss'
})
export class LspDetailComponent {
  @Input() lspDetail: LspResponse | null = null;
}

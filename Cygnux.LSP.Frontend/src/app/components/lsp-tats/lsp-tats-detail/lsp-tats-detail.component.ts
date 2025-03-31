import { Component, Input } from '@angular/core';
import { LspTatResponse } from '../../../shared/models/lsp-tat.model';

@Component({
  selector: 'lsp-tats-detail',
  standalone: false,
  templateUrl: './lsp-tats-detail.component.html',
  styleUrl: './lsp-tats-detail.component.scss'
})
export class LspTatsDetailComponent {
  @Input() lspTatsDetail: LspTatResponse | null = null;

}

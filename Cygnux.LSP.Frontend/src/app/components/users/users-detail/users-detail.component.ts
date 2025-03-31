import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../shared/models/user.model';

@Component({
  selector: 'users-detail',
  standalone: false,
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.scss'
})
export class UsersDetailComponent {
  @Input() usersDetail: UserResponse | null = null;
}

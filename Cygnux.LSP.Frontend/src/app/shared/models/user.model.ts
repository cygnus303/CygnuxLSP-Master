export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface AddUserRequest {
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  roles: string[];
}

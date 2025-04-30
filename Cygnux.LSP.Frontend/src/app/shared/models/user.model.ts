export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  isActive: boolean;
  roles:string;
}

export interface AddUserRequest {
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  roles: string[];
}

export interface DeleteUserRequest{
    id:string,
    isDeleted:boolean
}

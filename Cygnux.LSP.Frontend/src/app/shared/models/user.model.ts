export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  isActive: boolean;
  roles:string;
  customerName:string;
  location:string;
  sessionTime:number;
  address:string;
  locality:string;
  city:string;
  zipCode:string;
  userType:string;
  isResendMail:boolean;
  isMailSend:boolean;
}

export interface AddUserRequest {
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  roles: string[];
}
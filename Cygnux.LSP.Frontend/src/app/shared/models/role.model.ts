export interface RoleResponse {
  id: string;
  roleName: string;
  isActive: boolean;
}

export  interface RoleRequest{
  isActive : boolean;
  roleName : string;
}


export interface RolePermissionResponse {
    menuId: string;
    roleId: string;
    menuName: string;
    canView: boolean;
    canEdit: boolean;
    canCreate: boolean;
    canDelete: boolean;
}

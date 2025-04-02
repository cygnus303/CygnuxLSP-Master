export interface MenuResponse {
    menuId: string;
    menuName: string;
    isActive: boolean;
    icon: string;
    navigationUrl: string;
}
export interface MenuRoleResponse {
    menuId: string;
    menuName: string;
    navigationUrl: string;
    icon: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canCreate:boolean;
}

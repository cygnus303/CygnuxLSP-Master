export interface MenuResponse {
    menuId: string;
    menuName: string;
    isActive: boolean;
    icon: string;
    navigationUrl: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canCreate:boolean;
    canstatusUpdate:boolean;
    canPOD:boolean;
}
export interface LogoImagesResponse {
    roleId: string;
    roleName: string;
    normalizedName: string;
    logoLink: string;
}
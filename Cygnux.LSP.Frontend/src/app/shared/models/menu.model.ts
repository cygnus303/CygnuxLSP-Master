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
}

export interface LspMappingResponse {
    customerId: string;
    lspResponses?: LspResponse[] | undefined;
    lspIds?: string[] | undefined;
    lsps?: string;
    customerName?: string;
    isActive?: boolean;
    supportEmail?:string;
    lspMappingId?:any;
    lspName?:string;
    lspId?:string;
    isCustomerActive?:boolean;
}
export interface LspResponse {
    lspId: string;
    lspName: string;
}
export interface AddLspMappingRequest {
    lspId: number;
    customerId: string;
    isActive: string;
}

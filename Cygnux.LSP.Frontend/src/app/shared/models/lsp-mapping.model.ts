export interface LspMappingResponse {
    lspMappingId?: string;
    customerId: string;
    lspResponses?: LspResponse[] | undefined;
    lspIds?: string[] | undefined;
    lsps?: string;
    customerName?: string;
    isActive?: boolean;
    supportEmail:string;
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

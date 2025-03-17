export interface LspMappingResponse {
    lspMappingId: string;
    customerId: string;
    lspResponses: LspResponse[];
    lspIds: string[];
    lsps: string;
    customerName: string;
    isActive: boolean;
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

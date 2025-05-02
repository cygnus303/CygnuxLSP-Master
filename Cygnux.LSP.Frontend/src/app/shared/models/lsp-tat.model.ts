export interface LspTatResponse {
    lspTatId: string;
    customerId: string;
    lspId: string;
    product: string;
    origin:string;
    destination: string;
    lspName: string;
    tat: string;
    customerName: string;
    isActive: boolean;
    destinationState:string;
    priority:string;
    bookingType:string;
    mode:string;
    emailId:string;
}

export interface AddLspTatRequest {
    lspId: number;
    customerId: string;
    product: string;
    origin:string;
    destination: string;
    destinationState: string;
    mode: string;
    tat: string;
    priority: string;
    bookingType: string;
    isActive: string;
}

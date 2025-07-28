export interface LspTatResponse {
    lspTatId: string;
    customerId: string;
    lspId: string;
    product: string;
    origin: string;
    destination: string;
    lspName: string;
    tat: string;
    customerName: string;
    isActive: boolean;
    destinationState: string;
    priority: string;
    bookingType: string;
    mode: string;
    emailId: string;
    modedesc: string;
    priorityDesc: string;
    modeDescription: string;
    isCustomerMapping: boolean;
    ratePerKG:number;
}

export interface AddLspTatRequest {
    lspId: number;
    customerId: string;
    product: string;
    origin: string;
    destination: string;
    destinationState: string;
    mode: string;
    tat: string;
    priority: string;
    bookingType: string;
    isActive: string;
}

export interface validateFileResponse {
    customerName: string,
    lspName: string,
    product: string,
    origin: string,
    destination: string,
    destinationState: string,
    originstate: string,
    rateperKG: number,
    priority: number,
    bookingType: string,
    mode: string,
    tat: number,
    errorMessage: string,
    errorCode: number
}

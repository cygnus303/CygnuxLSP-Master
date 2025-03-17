export interface LspResponse {
    lspId: string;
    lspName: string;
    emailId: string;
    mobileNo: string;
    alias: string;
    description: string;
    apiKey: string;
    apiUrl: string;
    apiUserName: string;
    apiPassword: string;
    logo: string;
    isActive: boolean;
}

export interface AddLspRequest {
    lspId: number;
    lspName: string;
    emailId: string;
    mobileNo: string;
    alias: string;
    description: string;
    apiKey: string;
    apiUrl: string;
    apiUserName: string;
    apiPassword: string;
    logo: string;
    isActive: boolean;
}

export interface CommonResponse {
    message: string;
    status: string;
    id: string;
}
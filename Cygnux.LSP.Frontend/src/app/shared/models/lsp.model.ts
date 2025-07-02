export interface LspResponse {
    lspId: string;
    lspName: string;
    emailId: string;
    mobileNo: string;
    alias: string;
    description: string;
    apiKey: string;
    apiUrl: string;
    apiUsername: string;
    apiPassword: string;
    logo: string;
    isActive: boolean;
    address:string;
    zipCode:number;
    city:string;
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

export interface CountResponse{
  name:string,
  count:number,
  headerColor:string;
  progress:string;
  color:string;
  icon:string;
}

export interface LspMappingResponse {
  customerMappings: CustomerMapping[];
  tatDetails: TatDetail[];
  dockets: Docket[];
  status: boolean;
}

export interface CustomerMapping {
  customerId: string;
  customerName: string;
  lspId: string;
  lspName: string;
}

export interface TatDetail {
  lspId: string;
  lspName: string;
  origin: string;
  destination: string;
}

export interface Docket {
  docketNo: string;
  transporter: string;
}

export interface CustomerLspMap {
  customerLspMapId: string;
  customerId: string;
  customerName: string;
  lspId: string;
  lspName: string;
  tatId: string;
  origin: string;
  destination: string;
  docketNo: string;
}

export interface CustomerLspTat {
  tatId: string;
  customerId: string;
  customerName: string;
  lspId: string;
  lspName: string;
  origin: string;
  destination: string;
  docketNo: string;
}

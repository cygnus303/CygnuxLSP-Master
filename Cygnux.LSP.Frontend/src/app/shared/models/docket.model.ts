export interface DocketResponse {
  id: string;
  docketId:string;
  docketNo: string;
  bookingDate: Date;
  fromLocation: string;
  toLocation: string;
  customerId: string;
  invoiceNo: string;
  trasporter: string;
  transportMode: string;
  quantity: number;
  transporter:string;
  currentStatus:string;
  transportModeDesc:string;
  transporterDesc:string;
  currentStatusDesc:string
  customerName:string;
  podLink:string;
  isLspTatActive:boolean;
}

export interface AddDocketRequest {
  docketNo: string;
  bookingDate: Date;
  fromLocation: string;
  toLocation: string;
  customerId: string;
  invoiceNo: string;
  trasporter: string;
  transportMode: string;
  quantity: number;
}

export interface CustomerLocationResponse{
  customerId:string;
  location: string;
  lspId: string;
}

export interface TrackingListResponse{
    codeId: number,
    codeDesc: String
}

export interface ValidateFileResponse{
    customerName: string;
    lspName: string;
    docketNo: string;
    invoiceNo: string;
    date: string;
    fromLocation: string;
    toLocation: string;
    quantity: number;
    modeOfTransporter: string;
    errorMessage: string;
    errorCode: boolean;
    customer:string;
    lsp:string;
}

export interface ValidateDocketStatusList{
  id: number,
  lspName: string;
  docketNumber: string;
  nextDocketStatus: string;
  statusDate: string;
  errorCode: number,
  errorMessage: string;
  transporter: string;
  currentStatusCode: string;
}

export interface ValidDatePOD {
  id: number;
  docketNo: string;
  uploadDate: string;
  imageLink: string;
  imageName: string;
  lspId: string;
  lspName: string;
  customerId: string;
  customerName: string;
  validationStatus: string;
  isValid: boolean;
}

export interface UploadedImages {
  file: File | null;
  name: string;
}

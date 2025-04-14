export interface DocketResponse {
  id: string;
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
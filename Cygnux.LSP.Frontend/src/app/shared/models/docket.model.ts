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

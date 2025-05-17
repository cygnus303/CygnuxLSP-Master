export interface TrackTraceResponse{
    docketId: string;
    docketNo: string;
    bookingDate: string;
    fromLocation: string;
    toLocation: string;
    customerId: string;
    customerName: string;
    invoiceNo: string;
    transporter: string;
    transporterDesc: string;
    transportMode: string;
    transportModeDesc: string;
    quantity: string;
    entryBy: string;
    entryDate: string;
    currentStatus: string;
    currentStatusDesc: string;
}

export interface IRange {
  value: Date[];
  label: string;
}
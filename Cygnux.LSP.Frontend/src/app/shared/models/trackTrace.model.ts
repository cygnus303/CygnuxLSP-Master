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
    podLink:string;
    statusHistoryJson:any;
}

export interface IRange {
  value: Date[];
  label: string;
}

export interface DocketCountResponse{
  name:string,
  count:number,
  headerColor:string;
  progress:string;
  color:string;
  icon:string;
}

export interface DownloadPODResponse{
    docketNo: string;
    transporter: string;
    transporterDesc: string;
    podLink: string;
}
export interface CustomerResponse {
    customerId: string;
    customerName: string;
    customerCode: string;
    emailId: string;
    purchaseHead: string;
    purchaseHead_MobileNo: string;
    accountsHead: string;
    accountsHead_MobileNo: string;
    proprietorName: string;
    proprietor_MobileNo: string;
    proprietor_Email: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    isActive: boolean;
    channel: string;
    region: string;
    brand: string;
    subBrand: string;
    isAllowedForEwayBillGenration: boolean;
    isConsolidatedGSTNo: boolean;
    consolidatedGSTNo: string;
    businessClassification: string;
    address:string;
    tenantId:string;
    purchaseHeadMobileNo:string;
    accountsHeadMobileNo:string;
    proprietorMobileNo:string;
    proprietorEmail:string;
    userId:string;
}

export interface AddCustomerRequest {
    customerCode: string;
    purchaseHead: string;
    purchaseHead_MobileNo: string;
    accountsHead: string;
    accountsHead_MobileNo: string;
    proprietorName: string;
    proprietor_MobileNo: string;
    proprietor_Email: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    isActive: boolean;
    channel: string;
    region: string;
    brand: string;
    subBrand: string;
    isAllowedForEwayBillGenration: boolean;
    isConsolidatedGSTNo: boolean;
    consolidatedGSTNo: string;
    businessClassification: string;
}

export interface CustomerMapping {
  customerId: string;
  customerCode: string;
  customerName: string;
  lspId: string;
  lspName: string;
  origin: string;
  destination: string;
  firstName: string;
  lastName: string;
  email: string;
  docketNo: string;
}

export interface CheckCustomer{
  message:string;
}
export interface CityList{
  location:string;
}

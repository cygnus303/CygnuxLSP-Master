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
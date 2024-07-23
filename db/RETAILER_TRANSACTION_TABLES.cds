namespace DEALER_PORTAL_RETAILER_REGISTRATION;

using {
    DEALER_PORTAL_RETAILER_REGISTRATION.RETAILER_TYPE_MASTER,
    DEALER_PORTAL_RETAILER_REGISTRATION.CITY_MASTER,
    DEALER_PORTAL_RETAILER_REGISTRATION.COUNTRY_MASTER,
    DEALER_PORTAL_RETAILER_REGISTRATION.ADDRESS_TYPE_MASTER,
    DEALER_PORTAL_RETAILER_REGISTRATION.STATUS_MASTER,
    DEALER_PORTAL_RETAILER_REGISTRATION.DIVISION_MASTER
} from '../db/RETAILER_MASTER_TABLES';
using {
    DEALER_PORTAL.MASTER_REGION,
    DEALER_PORTAL.PAYMENT_ENTRY_STATUS_MASTER
} from '../db/MASTER_TABLES';

// context RETAILER_REGISTRATION {

entity RETAILER_DETAILS {
        key DISTRIBUTOR_ID   : String(10);
        key RETAILER_ID      : String(10);
            RETAILER_NAME    : String(50);
            NAME_OF_BANK     : String(50);
            BANK_ACC_NO      : String(20);
            IFSC_CODE        : String(20);
            UPI_ID           : String(30);
            // UPI_EXT          : String(10); 
            REGISTERED_TAX_ID  : String(15);
            PAN_NO           : String(10);
            // VAT_NO           : String(15);
            CREATION_DATE    : Date;
            RETAILER_TYPE    : Integer; //
            // SHIP_TO_PARTY    : String(100);
            BLOCKED          : String(1);
            CHANGE_DATE      : Date;
            RETAILER_CLASS   : String(1);
            PAY_TERM         : Integer;
            FIELD_1          : String(50);
            FIELD_2          : String(50);
            FIELD_3          : String(50);
            FIELD_4          : String(50);
            FIELD_5          : String(50);
            TO_ADDRESS       : Association to many RETAILER_ADDRESS_DETAIL
                                   on TO_ADDRESS.RETAILER_ID = RETAILER_ID;
            TO_RETAILER_TYPE : Association to one RETAILER_TYPE_MASTER
                                   on TO_RETAILER_TYPE.RETAILER_TYPE_ID = RETAILER_TYPE;
}


entity RETAILER_ATTACHMENTS {
    key DISTRIBUTOR_ID : String(10);
    key RETAILER_ID    : String(10);
    key FILE_ID        : Integer;
        @Core.ContentDisposition.Filename : FILE_NAME
        @Core.MediaType : FILE_MIMETYPE
        FILE_CONTENT   : LargeBinary;
        @Core.IsMediaType : true
        FILE_MIMETYPE  : String(100);
        FILE_TYPE      : String(100);
        FILE_NAME      : String(100);
}


entity RETAILER_TEMPLATE_ATTACHMENTS {
            // key DISTRIBUTOR_ID : String(10);
            // key RETAILER_ID    : String(10);
        key TEMPLATE_ID       : Integer;
            TEMPLATE_NAME     : String(100);

            @Core.ContentDisposition.Filename: TEMPLATE_NAME
            @Core.MediaType                  : TEMPLATE_MIMETYPE
            TEMPLATE_CONTENT  : LargeBinary;

            @Core.IsMediaType                : true
            TEMPLATE_MIMETYPE : String(100);
            TEMPLATE_TYPE     : String(100);

    }
// entity ATTACHMENTS{
//     key FILE_ID : Integer;
//     FILE_CONTENT :LargeBinary;
// }

entity RETAILER_PDC {
    key DISTRIBUTOR_ID : String(10);
    key RETAILER_ID    : String(10);
    key PDC_ID         : Integer;
        NAME_OF_BANK   : String(20);
        CHEQUE_NUMBER  : Integer;
        CREATION_DATE  : Date;
        AMOUNT         : Double;
        CURR_CODE      : String(5);
        TO_CURRENCY    : Association to one COUNTRY_MASTER
                             on TO_CURRENCY.CURR_CODE = CURR_CODE;
}

entity RETAILER_EVENT {
    key EVENT_ID       : Integer;
    key DISTRIBUTOR_ID : String(10);
    key RETAILER_ID    : String(10);
        RETAILER_NAME  : String(50);
        // MOBILE_NO      : String(15);
        CREATION_DATE  : Date;
        COMMENT        : String(100);
}

 entity RETAILER_ADDRESS_DETAIL {
        key DISTRIBUTOR_ID : String(10);
        key RETAILER_ID     : String(10);
        key SR_NO : Integer;
            ADDRESS_TYPE    : String(15);
            MOBILE_NO       : String(15);
            TELEPHONE_NO     : String(15);
            EMAIL_ID        : String(50);
            FAX_NO           : String(15);
            CONTACT_PERSON   : String(50);
            STREET_NO       : String(100);
            ADDRESS_LINE_1  : String(200);
            ADDRESS_LINE_2  : String(200);
            ADDRESS_LINE_3  : String(200);
            COUNTRY         : String(5); //
            REGION          : String(5); //
            CITY            : String(5); //
            POSTAL_CODE     : String(10);
            TO_ADDRESS_TYPE : Association to one ADDRESS_TYPE_MASTER
                                  on TO_ADDRESS_TYPE.ADDRESS_TYPE = ADDRESS_TYPE;
            TO_COUNTRY       : Association to one COUNTRY_MASTER
                               on TO_COUNTRY.LAND1 = COUNTRY;
        TO_REGION        : Association to one MASTER_REGION
                               on  TO_REGION.LAND1 = COUNTRY
                               and TO_REGION.BLAND = REGION;
        TO_CITY          : Association to one DEALER_PORTAL_RETAILER_REGISTRATION.CITY_MASTER
                               on TO_CITY.CITY_CODE = CITY;

    }

entity RETAILER_SO_HEADER {

    key DISTRIBUTOR_ID : String(10);
    //SALES ORDER NUMBER
    key SO_NO : String(10);
    key RETAILER_ID     : String(10);
    RETAILER_NAME    : String(50);
    //RETAILER_NAME  GROSS_TOTAL
    CREATION_DATE : Date;
    DIVISION : String(5);
    // DIVISION_DESC : String(100);
    SHIP_TO_PARTY : String(600);
    GROSS_TOTAL : String(100);
    STATUS : Integer;
    TO_STATUS : Association to one STATUS_MASTER on
                TO_STATUS.CODE = STATUS;
    TO_DIVISION :Association to one DIVISION_MASTER on
                TO_DIVISION.DIVISION = DIVISION;
    TO_SO_ITEM_REF :Association to many RETAILER_SO_ITEMS on
                TO_SO_ITEM_REF.SO_NO=SO_NO;

}  

entity RETAILER_SO_ITEMS {
    key SO_NO : String(10);
    key RETAILER_ID     : String(10);
    key ITEM_NO : Integer64;
    MATERIAL_GROUP      : String(50);
    MATERIAL_GROUP_DESC : String(100);
    MATERIAL_CODE : String(40);
    MATERIAL_DESC : String(50);
    HSN_CODE : String(10);
    UNIT_OF_MEASURE : String(3); 
    QUANTITY :  Integer;
    FREE_QUANTITY :  String(10);
    DISPATCH_QUANTITY :  Integer;//added
    STD_PRICE :  String(10);
    BASE_PRICE :  String(10);
    DISC_AMOUNT :  String(10); //Discount amount
    DISC_PERCENTAGE :  String(10); //Discount percentage
    NET_AMOUNT :  String(100);
    TOTAL_AMOUNT :  String(100); 
    CGST_PERC :  String(10);
    CGST_AMOUNT :  String(10);
    SGST_PERC :  String(10);
    SGST_AMOUNT :  String(10);
    IGST_PERC :  String(10);
    IGST_AMOUNT :  String(10);
    TAXES_AMOUNT :  String(10); //total tax amount
    // PROMO : String(1);

    //QUANTITY * STD_PRICE = NET_AMOUNT
    //CGST_AMOUNT + SGST_AMOUNT = TAXES_AMOUNT
    //NET_AMOUNT + TAXES_AMOUNT=TOTAL_AMOUNT

    //PENDING_QUANTITY = QUANTITY-DISPATCH_QUANTITY

}

entity RETAILER_DUMMY{
    DISTRIBUTOR_ID: String(10);
    MATERIAL_GROUP      : String(50);
    MATERIAL_GROUP_DESC : String(100);
    MATERIAL_CODE : String(40);
    MATERIAL_DESC : String(50);
    HSN_CODE : String(10);
    UNIT_OF_MEASURE : String(3); 
    QUANTITY :  Integer;
    // FREE_QUANTITY :  String(10);
    STD_PRICE :  String(10);
    BASE_PRICE :  String(10);
    DISC_AMOUNT :  String(10); //Discount amount
    DISC_PERCENTAGE :  String(10); //Discount percentage
    NET_AMOUNT :  String(100);
    TOTAL_AMOUNT :  String(10); 
    CGST_PERC :  String(10);
    CGST_AMOUNT :  String(10);
    SGST_PERC :  String(10);
    SGST_AMOUNT :  String(10);
    IGST_PERC :  String(10);
    IGST_AMOUNT :  String(10);
    TAXES_AMOUNT :  String(10); //total tax amount
}
entity RETAILER_DELIVERY_HEADER { 
    key DISTRIBUTOR_ID : String(10);
    key DELIVERY_NO : String(10);
    key SO_NO : String(10);
    key RETAILER_ID : String(10);
    CREATION_DATE :  Date;
    DIVISION :  String(5);
    TRANSPORTER_NAME :  String(100);
    DESTINATION : String(100);
    VEHICLE_NO : String(15);
    GROSS_WEIGHT : Double;
    GROSS_TOTAL : String(100);
    TOTAL_NO_PACKAGES : Integer;
    E_WAY_BILL_NO : String(30);
    E_WAY_BILL_DATE : Date;
    LR_DATE : Date;
    LR_NO : String(30);
    SHIPPING_CHARGES : Double;
    REFERENCE : String(50);
    TO_DIVISION :Association to one DIVISION_MASTER on
                TO_DIVISION.DIVISION = DIVISION;
    TO_DELIVERY_ITEM_REF : Association to many RETAILER_DELIVERY_ITEM on
                            TO_DELIVERY_ITEM_REF.DELIVERY_NO=DELIVERY_NO;
}

entity RETAILER_DELIVERY_ITEM {
    key DELIVERY_NO : String(10);
    key DELIVERY_ITEM_NO : Integer;
    BATCH : String(10);
    MATERIAL_GROUP : String(40);
    MATERIAL_GROUP_DESC : String(50);
    MATERIAL_CODE : String(40);
    MATERIAL_DESC : String(50);
    ORDER_QUANTITY : Integer;
    DELIVERY_QUANTITY : Integer;
    UNIT_OF_MEASURE : String(3); 
    STD_PRICE : String(10); 
    BASE_PRICE : String(10);
    DISC_AMOUNT : String(10);
    DISC_PERC : String(10);
    AMOUNT : String(10);
    TOTAL_AMOUNT : String(10);
    CGST_PERC : String(10);
    CGST_AMOUNT : String(10);
    SGST_PERC : String(10);
    SGST_AMOUNT : String(10);
    IGST_PERC : String(10);
    IGST_AMOUNT : String(10);
    TAXES_AMOUNT : String(10);
    HSN_CODE : String(10);
    
}

entity RETAILER_INVOICE_HEADER {
    key DISTRIBUTOR_ID : String(10);
    key SO_NO : String(10);
    key RETAILER_ID     : String(10);
    key INVOICE_NO : String(10);
    key DELIVERY_NO : String(10);
    RETAILER_NAME    : String(50);
    CREATION_DATE : Date;
    DIVISION : String(5);
    REFERENCE : String(50);
    GROSS_TOTAL : String(100);
    PAYMENT_STATUS     : Integer;
    PAYMENT_STATUS_REF : Association to one PAYMENT_ENTRY_STATUS_MASTER on 
                            PAYMENT_STATUS_REF.PAYMENT_STATUS = PAYMENT_STATUS;
    TO_DIVISION :Association to one DIVISION_MASTER on
                TO_DIVISION.DIVISION = DIVISION;
    TO_INVOICE_ITEM_REF : Association to many RETAILER_INVOICE_ITEM on
                        TO_INVOICE_ITEM_REF.INVOICE_NO=INVOICE_NO;
}

entity RETAILER_INVOICE_ITEM {
    key INVOICE_NO : String(10);
    key INVOICE_ITEM_NO : Integer;
    MATERIAL_GROUP : String(40);
    MATERIAL_GROUP_DESC : String(50);
    MATERIAL_CODE : String(40);
    MATERIAL_DESC : String(50);
    BATCH: String(10);
    INVOICE_QUANTITY : Integer;
    UNIT_OF_MEASURE : String(3);
    STD_PRICE : String(10);
    BASE_PRICE : String(10);
    DISC_AMOUNT : String(10);
    DISC_PERC : String(10);
    AMOUNT : String(10);
    TOTAL_AMOUNT : Double;
    CGST_PERC : String(10);
    CGST_AMOUNT : String(10);
    SGST_PERC : String(10);
    SGST_AMOUNT : String(10);
    IGST_PERC : String(10);
    IGST_AMOUNT : String(10);
    TAXES_AMOUNT : String(10);
    HSN_CODE : String(10);
}
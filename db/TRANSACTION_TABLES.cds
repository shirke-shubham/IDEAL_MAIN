namespace DEALER_PORTAL;

using {
    DEALER_PORTAL.MASTER_STATUS,
    DEALER_PORTAL.MASTER_ENTITY_CODE,
    DEALER_PORTAL.MASTER_REQUEST_TYPE,
    DEALER_PORTAL.MASTER_COUNTRY,
    DEALER_PORTAL.MASTER_REGION,
    DEALER_PORTAL.MASTER_CURRENCY,
    DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG,
    DEALER_PORTAL.MASTER_REGFORM_FIELDS_UPDATED,
    DEALER_PORTAL.MASTER_ADDRESS_TYPE,
    DEALER_PORTAL.MASTER_PAYMENT_EVENT,
    DEALER_PORTAL.MASTER_PAYMENT_STATUS,
    DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY,
    DEALER_PORTAL.MASTER_PR_STATUS,
    DEALER_PORTAL.MASTER_PR_EVENT,
    DEALER_PORTAL.MASTER_SO_STATUS,
    DEALER_PORTAL.MASTER_CLAIM_EVENT,
    DEALER_PORTAL.MASTER_CLAIM_STATUS,
    DEALER_PORTAL.MASTER_RGA_STATUS,
    DEALER_PORTAL.MASTER_RGA_EVENT_STATUS,
    DEALER_PORTAL.GRN_STATUS_MASTER,
    DEALER_PORTAL.PAYMENT_ENTRY_STATUS_MASTER,
    DEALER_PORTAL.MASTER_PPR_STATUS,
    DEALER_PORTAL.MASTER_PPR_EVENT_STATUS,
    DEALER_PORTAL.PR_STATUS_MASTER 
} from '../db/MASTER_TABLES';

entity IDEAL_ERROR_LOG {

    key LOG_ID           : String(50);
        REQUEST_NO       : Integer64;
        SR_NO            : Integer64;
        ERROR_CODE       : Integer64;
        ERROR_DESCRPTION : String(1000);
        CREATED_ON       : Timestamp;
        USER_ID          : String(50);
        USER_ROLE        : String(50);
        APP_NAME         : String(50);
        TYPE             : String(50);

}

entity REGFORM_FOLDER_IDS {

    key IDEAL_DIST_CODE : Int64;
        SAP_DIST_CODE   : String(10);
        OT_PARENT_ID    : String(10);
        OT_FOLDER1_ID   : String(25);
        OT_FOLDER2_ID   : String(25);
        OT_FOLDER3_ID   : String(25);
        OT_FOLDER4_ID   : String(25);
}

entity REQUEST_INFO {
    key REQUEST_NO               : Integer64;
        MOBILE_NO                : String(30); //added 05/01/2023
        SAP_DIST_CODE            : String(10); //SAP_DEALER_CODE
        IDEAL_DIST_CODE          : Integer64; //IDEAL_DEALER_CODE
        STATUS                   : Integer;
        REGISTERED_ID            : String(100); // Dealer Primary Email ID
        ENTITY_CODE              : String(10);
        REQUEST_TYPE             : Integer;
        CREATION_TYPE            : Integer;
        DIST_NAME1               : String(100); //DEALER_NAME1
        DIST_NAME2               : String(100); //DEALER_NAME2
        DIST_CODE                : String(50); //DEALER_CODE
        APPROVER_LEVEL           : Integer;
        APPROVER_ROLE            : String(10);
        // HIERARCHY_ID             : String(10); --------
        REQUESTER_ID             : String(100); // Request creator i.e. Buyer Email ID
        BP_TYPE_CODE             : String(4);
        BP_TYPE_DESC             : String(100);
        REQUEST_RESENT           : String(5);
        MDG_CR_NO                : String(15);
        LAST_ACTIVE_REQ_NO       : Integer64;
        SECONDARY_EMAILS_ID      : String(500);
        ORG_ESTAB_YEAR           : String(4);
        WEBSITE                  : String(100);
        VAT_REG_NUMBER           : String(25);
        VAT_REG_DATE             : Date;
        VAT_CHECK                : String(1);
        LAST_SAVED_STEP          : Integer;
        COMPLETED_BY             : String(100);
        COMPLETED_BY_POSITION    : String(50);
        ACK_VALIDATION           : String(5);
        SUBMISSION_DATE          : Timestamp;
        LAST_UPDATED_ON          : Timestamp;
        OT_PARENT_ID             : String(10);
        OT_FOLDER1_ID            : String(25);
        OT_FOLDER2_ID            : String(25);
        OT_FOLDER3_ID            : String(25);
        OT_FOLDER4_ID            : String(25);
        NDA_TYPE                 : String(50);
        REMINDER_COUNT           : Integer;
        BUYER_ASSIGN_CHECK       : String(1);
        CREATED_ON               : Timestamp;
        COMMENT                  : String(1000);
        LEGACY_ID                : String(10);
        //refer from ideal
        BU_CODE                  : String(50);
        TOT_PERM_EMP             : Integer;
        TOT_TEMP_EMP             : Integer;
        NOE_ACC                  : Integer;
        NOE_ADM                  : Integer;
        NOE_HR                   : Integer;
        NOE_QA                   : Integer;
        NOE_MAN                  : Integer;
        NOE_SAL                  : Integer;
        NOE_SEC                  : Integer;
        NOE_ANY                  : Integer;
        SAP_DIST_NO              : String(10);
        PROPOSAL_DATE            : Date;
        ENTITY_NAME              : String(50);
        BUSINESS_NATURE          : String(20);
        TERR_HOSP_ACC            : String(100);
        SELLING_POINT            : String(200);
        DIST_RECOMMMEDATION      : String(200);
        DIST_RELATION            : String(200);
        SALES_ASSOCIATE_ID       : String(100);
        SA_APPROVED_ON           : Timestamp;
        SAVED_AS_DRAFT           : Integer;
        LIC_NO                   : String(50);
        LIC_NO_DATE              : Date;
        // Fields from ideal
        REGISTERED_ADDR          : String(10);
        OFFICE_ADDR              : String(10);
        SHIP_TO_ADDR             : String(10);
        WAREHOUSE_ADDR           : String(10);
        //commented fields from iven
        // SUPPL_CATEGORY           : String(5000);
        // SUPPL_CATEGORY_DESC      : String(5000);
        // BUSINESS_TYPE            : String(50);
        // TRADE_LIC_NO             : String(50);
        // TRADE_LIC_NO_DATE        : Date;
        // APPROVER_ROLE            : String(50);
        // NEXT_APPROVER            : String(100);
        // SUPPL_TYPE            : String(50);
        // SUPPL_TYPE_DESC       : String(50);
        TO_STATUS                : Association to one DEALER_PORTAL.MASTER_STATUS
                                       on TO_STATUS.CODE = STATUS;
        TO_ENTITY_CODE           : Association to one DEALER_PORTAL.MASTER_ENTITY_CODE
                                       on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;
        TO_REQUEST_TYPE          : Association to one DEALER_PORTAL.MASTER_REQUEST_TYPE
                                       on TO_REQUEST_TYPE.CODE = REQUEST_TYPE;
        TO_ADDRESS               : Association to many DEALER_PORTAL.REGFORM_ADDRESS
                                       on TO_ADDRESS.REQUEST_NO = REQUEST_NO;
        TO_CONTACTS              : Association to many DEALER_PORTAL.REGFORM_CONTACTS
                                       on TO_CONTACTS.REQUEST_NO = REQUEST_NO;
        TO_BANKS                 : Association to many DEALER_PORTAL.REGFORM_BANKS
                                       on TO_BANKS.REQUEST_NO = REQUEST_NO;
        // TO_OWNERS                : Association to many DEALER_PORTAL.REGFORM_OWNERS
        //                                on TO_OWNERS.REQUEST_NO = REQUEST_NO;
        // TO_PRODUCT_SERVICES      : Association to many DEALER_PORTAL.REGFORM_PRODUCT_SERVICE
        //                                on TO_PRODUCT_SERVICES.REQUEST_NO = REQUEST_NO;
        // TO_CAPACITY              : Association to many DEALER_PORTAL.REGFORM_CAPACITY
        //                                on TO_CAPACITY.REQUEST_NO = REQUEST_NO;
        TO_CUSTOMERS             : Association to many DEALER_PORTAL.REGFORM_CUSTOMERS
                                       on TO_CUSTOMERS.REQUEST_NO = REQUEST_NO;
        TO_PROMOTERS             : Association to many DEALER_PORTAL.REGFORM_PROMOTERS
                                       on TO_PROMOTERS.REQUEST_NO = REQUEST_NO;
        TO_BUSINESS_HISTORY      : Association to many DEALER_PORTAL.REGFORM_BUSINESS_HISTORY
                                       on TO_BUSINESS_HISTORY.REQUEST_NO = REQUEST_NO;
        TO_BANKING_DETAILS       : Association to many DEALER_PORTAL.REGFORM_BANKING_DETAILS
                                       on TO_BANKING_DETAILS.REQUEST_NO = REQUEST_NO;
        TO_ATTACH_FIELDS         : Association to many DEALER_PORTAL.REGFORM_ATTACH_FIELDS
                                       on TO_ATTACH_FIELDS.REQUEST_NO = REQUEST_NO;
        TO_ATTACHMENTS           : Association to many DEALER_PORTAL.REGFORM_ATTACHMENTS
                                       on TO_ATTACHMENTS.REQUEST_NO = REQUEST_NO;
        TO_MANDATORY_FIELDS      : Association to one DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG
                                       on  TO_MANDATORY_FIELDS.CCODE    = ENTITY_CODE
                                       and TO_MANDATORY_FIELDS.REQ_TYPE = CREATION_TYPE
                                       and TO_MANDATORY_FIELDS.TYPE     = 'M';
        TO_VISIBLE_FIELDS        : Association to one DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG
                                       on  TO_VISIBLE_FIELDS.CCODE    = ENTITY_CODE
                                       and TO_VISIBLE_FIELDS.REQ_TYPE = CREATION_TYPE
                                       and TO_VISIBLE_FIELDS.TYPE     = 'V';
        TO_UPDATED_FIELDS        : Association to one DEALER_PORTAL.MASTER_REGFORM_FIELDS_UPDATED
                                       on TO_UPDATED_FIELDS.REQ_NO = REQUEST_NO;
        TO_REQUEST_ACTIVE_STATUS : Association to one DEALER_PORTAL.REQUEST_ACTIVE_STATUS
                                       on TO_REQUEST_ACTIVE_STATUS.REQUEST_NO = REQUEST_NO;
//added for role ------
// TO_HIERARCHY_ROLE           : Association to many DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY
//                                on TO_HIERARCHY_ROLE.HIERARCHY_ID = HIERARCHY_ID;
}

entity REQUEST_EVENTS_LOG {

    key REQUEST_NO : Integer64;
    key EVENT_NO   : Integer;
        EVENT_CODE : Integer;
        EVENT_TYPE : String(20);
        USER_ID    : String(100);
        USER_NAME  : String(100);
        REMARK     : String(100);
        COMMENT    : String(1000);
        CREATED_ON : Timestamp;

}

entity DEALER_MASTER_S4_HANA {
    key BUKRS : String(4);
    key LIFNR : String(10);
        NAME1 : String(35);
}

entity USER_DELEGATION {

    key SR_NO          : Integer;
        ASSIGN_FROM    : String(50);
        ASSIGN_TO      : String(50);
        ASSIGN_TO_NAME : String(100);
        REASON         : String(1000);
        DEL_FROM_DATE  : Timestamp;
        DEL_TO_DATE    : Timestamp;
        STATUS         : String(1);
        ENTITY_CODE    : String(10);

}

entity REQUEST_ACTIVE_STATUS {

    key REQUEST_NO      : Integer64;
        ACTIVE          : String(1);
        TYPE            : Integer;
        UPDATED_ON      : Timestamp;
        IDEAL_DIST_CODE : Integer64;

}

entity IDEAL_EMAIL_LOG {

    key LOG_ID       : UUID;
        STATUS       : Integer;
        STATUS_DSC   : String(50);
        LOG          : String;
        CREATED_ON   : Timestamp;
        CREATED_DATE : Timestamp;
        USER_ID      : String(50);
        TO_EMAIL     : String(1000);
        CC_EMAIL     : String(1000);
        SUBJECT      : String(100);
        BODY         : String;
        TYPE         : String(10);

}

entity REGFORM_BUSINESS_HISTORY {

    key REQUEST_NO    : Integer64 not null;
    key SR_NO         : Integer not null;
        DEALERSHIP    : String(50);
        SUPPLIER_NAME : String(50);
        SINCE         : Integer;
        PROD_GROUP    : String(50);
        PURCHASES     : Integer;

}

entity REGFORM_CUSTOMERS {
    key REQUEST_NO    : Integer64 not null;
    key SR_NO         : Integer;
        CUST_NO       : Integer;
        CUSTOMER_NAME : String(100);
        YEAR1         : String(4);
        YEAR2         : String(4);
}

entity REGFORM_PROMOTERS {

    key REQUEST_NO    : Integer64 not null;
    key SR_NO         : Integer;
        NAME          : String(50);
        QUALIFICATION : String(20);
        WORK_EXP      : String(10);
        YRS_IN_COMP   : String(10);
        DESIGNATION   : String(20);
        ROLE          : String(20);

}

entity REGFORM_ADDRESS {

    key REQUEST_NO       : Integer64;
    key SR_NO            : Integer;
        ADDRESS_TYPE     : String(50);
        ADDRESS_DESC     : String(50);
        HOUSE_NUM1       : String(10);
        STREET1          : String(60);
        STREET2          : String(40);
        STREET3          : String(40);
        STREET4          : String(40);
        CITY             : String(100);
        STATE            : String(100);
        COUNTRY          : String(100);
        POSTAL_CODE      : String(10);
        CONTACT_NO       : String(30);
        CONTACT_TELECODE : String(4);
        FAX_NO           : String(10);
        EMAIL            : String(241);
        DISTRICT         : String(35);
        //taken from ideal
        ADDR_CODE        : String(10);
        TO_COUNTRY       : Association to one MASTER_COUNTRY
                               on TO_COUNTRY.LAND1 = COUNTRY;
        TO_REGION        : Association to one MASTER_REGION
                               on  TO_REGION.LAND1 = COUNTRY
                               and TO_REGION.BLAND = STATE;
        TO_ADDR_TYPE     : Association to one MASTER_ADDRESS_TYPE
                               on TO_ADDR_TYPE.CODE = ADDR_CODE;
}

entity REGFORM_CONTACTS {
    key REQUEST_NO       : Integer64;
    key SR_NO            : Integer;
        NAME1            : String(35);
        NAME2            : String(35);
        HOUSE_NUM1       : String(10);
        STREET1          : String(40);
        STREET2          : String(40);
        CITY             : String(100);
        STATE            : String(100);
        POSTAL_CODE      : String(10);
        DESIGNATION      : String(50);
        NATIONALITY      : String(30);
        PASSPORT_NO      : String(30);
        EMAIL            : String(241);
        CONTACT_NO       : String(30);
        MOBILE_NO        : String(30);
        CONTACT_TYPE     : String(10);
        CONTACT_TELECODE : String(4);
        MOBILE_TELECODE  : String(4);
        BP_ID            : String(10);
        //taken from ideal
        LOC_NO           : Integer; //not null;
        LOC_TYPE         : String(2); //not null;
        BR_WH_NO         : Integer;
        ADDR_CODE        : String(10);
        CONCERN_TYPE     : String(10);
        INFRA_DETAIL     : String(50);
        TEMP_DETAIL      : Integer;
        PROPERTY_TYPE    : String(10);
        ON_LEASE         : String(1);
        ATTACH_CODE      : Integer;
        FILE_NAME        : String(100);
        FILE_TYPE        : String(100);
        FILE_MIMETYPE    : String(100);
        FILE_CONTENT     : LargeBinary;
        UPLOAD_DATE      : Timestamp;
        TO_COUNTRY       : Association to one MASTER_COUNTRY
                               on TO_COUNTRY.LAND1 = NATIONALITY;
        TO_REGION        : Association to one MASTER_REGION
                               on  TO_REGION.LAND1 = NATIONALITY
                               and TO_REGION.BLAND = STATE;
}

entity REGFORM_ATTACHMENTS {

    key REQUEST_NO       : Integer64;
    key SR_NO            : Integer;
        ATTACH_CODE      : Integer;
        ATTACH_GROUP     : String(30);
        ATTACH_DESC      : String(100);
        ATTACH_VALUE     : String(100);
        EXPIRY_DATE      : Date;
        FILE_NAME        : String(100);
        FILE_TYPE        : String(100);
        FILE_MIMETYPE    : String(100);
        FILE_CONTENT     : LargeBinary;
        UPLOADED_ON      : Timestamp;
        OT_DOC_ID        : String(10);
        OT_LAST_DOC_ID   : String(10);
        UPDATE_FLAG      : String(1);
        DELETE_FLAG      : String(1);
        ATTACH_SHORT_DEC : String(50);
        ATTACH_FOR       : String(50);
        TO_CMS           : Association to one DEALER_PORTAL.REGFORM_ATTACHMENTS_CMS
                               on TO_CMS.DOC_ID = OT_DOC_ID;
}

entity REGFORM_ATTACH_FIELDS {
    key REQUEST_NO                 : Integer64;
        // If UAE Company
        IS_UAE_COMPANY             : String(5);
        // Do you issue an Electronic Tax Invoice
        ISSUE_ELEC_TAX_INV         : String(100);
        // Are you a Sole Agent / Distributor / Dealer for a manufacturer / service provider
        SOLE_DIST_MFG_SER          : String(5);
        //SOLE_DIST_MFG_SER_TYPE : String(100);

        // Passport  Representative / Authorized person
        PASSPORT_OF_AUTH_SIGNATORY : String(5);
        PASSPORT_REPR_AUTH_PERSON  : String(5);
}

entity REGFORM_ATTACHMENTS_CMS {
        // key REQUEST_NO
        // key SR_NO            : Integer;

    key DOC_ID        : Integer64;
        FILE_NAME     : String(100);

        @Core.IsMediaType                : true
        FILE_MIMETYPE : String(100);

        @Core.ContentDisposition.Filename: FILE_NAME
        @Core.MediaType                  : FILE_MIMETYPE
        FILE_CONTENT  : LargeBinary;
        UPLOADED_ON   : Timestamp;
        ACTIVE_FLAG   : String(1);

        @Core.IsURL
        URL           : String;
}

// entity REGFORM_ATTACHMENTS_CMS_CHECK {
//         // key REQUEST_NO
//         // key SR_NO            : Integer;
//     key DOC_ID        : Integer64;
//         FILE_NAME     : String(100);
//         FILE_MIMETYPE : String(100);
//         FILE_CONTENT  : LargeBinary;
//         UPLOADED_ON   : Timestamp;
//         ACTIVE_FLAG   : String(1);
// }

entity SUPPLIER_PROFILE_LOG {

    key SAP_DIST_CODE      : String(10);
    key EVENT_NO           : Integer;
        EVENT_CODE         : Integer;
        EVENT_TYPE         : String(20);
        USER_ID            : String(100);
        USER_NAME          : String(100);
        REMARK             : String(100);
        COMMENT            : String(1000);
        UPDATED_ON         : Timestamp;
        UPDATED_FIELD_NAME : String(100);
        CHANGE_VALUE       : String(5000);
        ORG_VALUE          : String(5000);
        REQUEST_NO         : Integer64;
}

entity REGFORM_BANKS {

    key REQUEST_NO          : Integer64;
    key SR_NO               : Integer;
        NAME                : String(100);
        BENEFICIARY         : String(100);
        ACCOUNT_NO          : String(38); //18 (account no) + 20 (BankRef)
        ACCOUNT_NAME        : String(40);
        ACCOUNT_HOLDER      : String(60);
        BANK_ID             : String(4);
        BANK_KEY            : String(15);
        BANK_COUNTRY        : String(50); //3 length
        BRANCH_NAME         : String(100);
        IBAN_NUMBER         : String(34); //34 length
        SWIFT_CODE          : String(15);
        BIC_CODE            : String(15);
        ROUTING_CODE        : String(15);
        OTHER_CODE          : String(1);
        OTHER_CODE_NAME     : String(15);
        OTHER_CODE_VAL      : String(15);
        PAYMENT_METHOD      : String(25);
        PAYMENT_METHOD_DESC : String(30);
        PAYMENT_TERMS       : String(25);
        PAYMENT_TERMS_DESC  : String(30);
        INVOICE_CURRENCY    : String(25);
        VAT_REG_NUMBER      : String(25);
        VAT_REG_DATE        : Date;
        DUNS_NUMBER         : String(10);
        BANK_CURRENCY       : String(5);
        BANK_NO             : String(15);
        PAYMENT_TYPE        : String(10);
        TO_COUNTRY          : Association to one MASTER_COUNTRY
                                  on TO_COUNTRY.LAND1 = BANK_COUNTRY;
        TO_CURRENCY         : Association to one MASTER_CURRENCY
                                  on TO_CURRENCY.WAERS = BANK_CURRENCY;
}

entity REGFORM_BANKING_DETAILS {

    key REQUEST_NO   : Integer64;
    key SR_NO        : Integer;
        NAME         : String(100);
        BRANCH_NAME  : String(100);
        //Fields From Ideal
        FACILTY      : String(20);
        AMOUNT_LIMIT : Double;
        ASSO_SINCE   : Integer;

}

entity REQUEST_SECURITY_CODE {

    key REGISTERED_ID : String(100);
        SEC_CODE      : String(100);
        CREATED_ON    : Timestamp;

}

entity REQUEST_INFO_TEMP {
    key REQUEST_NO            : Integer64;
    key TEMP_ID               : Integer64;
        MOBILE_NO             : String(30); //added 05/01/2023
        SAP_DIST_CODE         : String(10); //SAP_DEALER_CODE
        IDEAL_DIST_CODE       : Integer64; //IDEAL_DEALER_CODE
        STATUS                : Integer;
        REGISTERED_ID         : String(100); // Dealer Primary Email ID
        ENTITY_CODE           : String(10);
        REQUEST_TYPE          : Integer;
        CREATION_TYPE         : Integer;
        DIST_NAME1            : String(100); //DEALER_NAME1
        DIST_NAME2            : String(100); //DEALER_NAME2
        DIST_CODE             : String(50); //DEALER_CODE
        APPROVER_LEVEL        : Integer;
        APPROVER_ROLE         : String(10);
        // HIERARCHY_ID          : String(10); ---------
        REQUESTER_ID          : String(100); // Request creator i.e. Buyer Email ID
        BP_TYPE_CODE          : String(4);
        BP_TYPE_DESC          : String(100);
        REQUEST_RESENT        : String(5);
        MDG_CR_NO             : String(15);
        LAST_ACTIVE_REQ_NO    : Integer64;
        SECONDARY_EMAILS_ID   : String(500);
        ORG_ESTAB_YEAR        : String(4);
        WEBSITE               : String(100);
        VAT_REG_NUMBER        : String(25);
        VAT_REG_DATE          : Date;
        VAT_CHECK             : String(1);
        LAST_SAVED_STEP       : Integer;
        COMPLETED_BY          : String(100);
        COMPLETED_BY_POSITION : String(50);
        ACK_VALIDATION        : String(5);
        SUBMISSION_DATE       : Timestamp;
        LAST_UPDATED_ON       : Timestamp;
        OT_PARENT_ID          : String(10);
        OT_FOLDER1_ID         : String(25);
        OT_FOLDER2_ID         : String(25);
        OT_FOLDER3_ID         : String(25);
        OT_FOLDER4_ID         : String(25);
        NDA_TYPE              : String(50);
        REMINDER_COUNT        : Integer;
        BUYER_ASSIGN_CHECK    : String(1);
        CREATED_ON            : Timestamp;
        COMMENT               : String(1000);
        LEGACY_ID             : String(10);
        LIC_NO                : String(50);
        LIC_NO_DATE           : Date;
        //refer from ideal
        BU_CODE               : String(50);
        TOT_PERM_EMP          : Integer;
        TOT_TEMP_EMP          : Integer;
        NOE_ACC               : Integer;
        NOE_ADM               : Integer;
        NOE_HR                : Integer;
        NOE_QA                : Integer;
        NOE_MAN               : Integer;
        NOE_SAL               : Integer;
        NOE_SEC               : Integer;
        NOE_ANY               : Integer;
        SAP_DIST_NO           : String(10);
        PROPOSAL_DATE         : Date;
        ENTITY_NAME           : String(50);
        BUSINESS_NATURE       : String(20);
        TERR_HOSP_ACC         : String(100);
        SELLING_POINT         : String(200);
        DIST_RECOMMMEDATION   : String(200);
        DIST_RELATION         : String(200);
        SALES_ASSOCIATE_ID    : String(100);
        SA_APPROVED_ON        : Timestamp;
        SAVED_AS_DRAFT        : Integer;
        // Fields from ideal
        REGISTERED_ADDR       : String(10);
        OFFICE_ADDR           : String(10);
        SHIP_TO_ADDR          : String(10);
        WAREHOUSE_ADDR        : String(10);
        TO_STATUS             : Association to one DEALER_PORTAL.MASTER_STATUS
                                    on TO_STATUS.CODE = STATUS;
}

entity REGFORM_ADDRESS_TEMP {

    key REQUEST_NO       : Integer64;
    key TEMP_ID          : Integer64;
    key SR_NO            : Integer;
        ADDRESS_TYPE     : String(50);
        ADDRESS_DESC     : String(50);
        HOUSE_NUM1       : String(10);
        STREET1          : String(60);
        STREET2          : String(40);
        STREET3          : String(40);
        STREET4          : String(40);
        CITY             : String(100);
        STATE            : String(100);
        COUNTRY          : String(100);
        POSTAL_CODE      : String(10);
        CONTACT_NO       : String(30);
        CONTACT_TELECODE : String(4);
        FAX_NO           : String(10);
        EMAIL            : String(241);
        DISTRICT         : String(35);
        //taken from ideal
        ADDR_CODE        : String(10);

}

entity REGFORM_CONTACTS_TEMP {

    key REQUEST_NO       : Integer64;
    key TEMP_ID          : Integer64;
    key SR_NO            : Integer;
        NAME1            : String(35);
        NAME2            : String(35);
        HOUSE_NUM1       : String(10);
        STREET1          : String(40);
        STREET2          : String(40);
        CITY             : String(100);
        STATE            : String(100);
        POSTAL_CODE      : String(10);
        DESIGNATION      : String(50);
        NATIONALITY      : String(30);
        PASSPORT_NO      : String(30);
        EMAIL            : String(241);
        CONTACT_NO       : String(30);
        MOBILE_NO        : String(30);
        CONTACT_TYPE     : String(10);
        CONTACT_TELECODE : String(4);
        MOBILE_TELECODE  : String(4);
        BP_ID            : String(10);
        //taken from ideal
        LOC_NO           : Integer not null;
        LOC_TYPE         : String(2) not null;
        BR_WH_NO         : Integer;
        ADDR_CODE        : String(10);
        CONCERN_TYPE     : String(10);
        INFRA_DETAIL     : String(50);
        TEMP_DETAIL      : Integer;
        PROPERTY_TYPE    : String(10);
        ON_LEASE         : String(1);
        ATTACH_CODE      : Integer;
        FILE_NAME        : String(100);
        FILE_TYPE        : String(100);
        FILE_MIMETYPE    : String(100);
        FILE_CONTENT     : LargeBinary;
        UPLOAD_DATE      : Timestamp;

}

//New tables for Sales order
entity SO_HEADER {

    key DISTRIBUTOR_ID : String(10);
        // key SO_NO : String(10);
    key SAP_SO_NO      : String(10);
        // key PR_NO : Integer64;
        CREATION_DATE  : Timestamp;
        DIVISION       : String(5);
        DIVISION_DESC  : String(100);
        SHIP_TO_PARTY  : String(200);
        STATUS_ID      : Integer;
        TO_STATUS      : Association to one DEALER_PORTAL.MASTER_SO_STATUS
                             on TO_STATUS.CODE = STATUS_ID;

}

entity SO_ITEMS {

    key SAP_SO_NO       : String(10);
        // key PR_NO : Integer64;
    key SO_ITEM_NO      : String(6);
        MATERIAL_CODE   : String(40);
        MATERIAL_DESC   : String(50);
        IMAGE_URL       : String(1000);
        HSN_CODE        : String(10);
        UNIT_OF_MEASURE : String(3);
        QUANTITY        : Integer;
        FREE_QUANTITY   : String(10);
        STD_PRICE       : String(10);
        BASE_PRICE      : String(10);
        DISC_AMOUNT     : String(10); //Discount amount
        DISC_PERC       : String(10); //Discount percentage
        NET_AMOUNT      : String(10);
        TOTAL_AMOUNT    : String(10);
        CGST_PERC       : String(10);
        CGST_AMOUNT     : String(10);
        SGST_PERC       : String(10);
        SGST_AMOUNT     : String(10);
        IGST_PERC       : String(10);
        IGST_AMOUNT     : String(10);
        TAXES_AMOUNT    : String(10); //total tax amount
// PROMO : String(1);

}

entity PR_HEADER {

    key PR_NO             : Integer64;
        SAP_SO_NO         : String(10);
        PR_CREATION_DATE  : Timestamp;
        DISTRIBUTOR_ID    : String(10);
        DISTRIBUTOR_NAME  : String(100);
        SHIP_TO           : String(30);
        SHIP_NAME         : String(200);
        SHIP_FROM         : String(200);
        BILL_TO           : String(30);
        // BU_CODE : String(10);
        ORDER_TYPE        : String(4);
        // KIT_CODE : Integer;
        PAYMENT_METHOD    : String(10);
        REGION_CODE       : String(3);
        PR_STATUS         : String(10);
        LAST_UPDATED_DATE : Timestamp;
        APPROVER_LEVEL    : Integer;
        APPROVER_ROLE     : String(50);
        GRAND_TOTAL       : String(20);
        TO_STATUS         : Association to one DEALER_PORTAL.MASTER_PR_STATUS
                                on TO_STATUS.CODE = PR_STATUS;
        TO_ITEMS          : Association to many PR_ITEMS
                                on TO_ITEMS.PR_NO = PR_NO;
        TO_EVENT          : Association to many PR_EVENT_LOG
                                on TO_EVENT.PR_NO = PR_NO;
        TO_PR_STATUS      : Association to one DEALER_PORTAL.PR_STATUS_MASTER
                                on TO_PR_STATUS.PR_STATUS = PR_STATUS;

}

entity PR_ITEMS {

    key PR_NO           : Integer64;
    key PR_ITEM_NO      : Integer;
        MATERIAL_CODE   : String(40);
        MATERIAL_DESC   : String(50);
        IMAGE_URL       : String(1000);
        HSN_CODE        : String(10);
        UNIT_OF_MEASURE : String(3);
        QUANTITY        : Integer;
        FREE_QUANTITY   : String(10);
        STD_PRICE       : String(10);
        BASE_PRICE      : String(10);
        DISC_AMOUNT     : String(10); //Discount amount
        DISC_PERC       : String(10); //Discount percentage
        NET_AMOUNT      : String(10);
        TOTAL_AMOUNT    : String(10);
        CGST_PERC       : String(10);
        CGST_AMOUNT     : String(10);
        SGST_PERC       : String(10);
        SGST_AMOUNT     : String(10);
        IGST_PERC       : String(10);
        IGST_AMOUNT     : String(10);
        TAXES_AMOUNT    : String(10); //total tax amount

}

entity PR_CART {

    key DISTRIBUTOR_ID  : String(10);
    key CART_ID         : Integer;
        MATERIAL_CODE   : String(40);
        MATERIAL_DESC   : String(50);
        IMAGE_URL       : String(1000);
        HSN_CODE        : String(10);
        UNIT_OF_MEASURE : String(3);
        QUANTITY        : Integer;
        FREE_QUANTITY   : String(10);
        STD_PRICE       : String(10);
        BASE_PRICE      : String(10);
        DISC_AMOUNT     : String(10); //Discount amount
        DISC_PERC       : String(10); //Discount percentage
        NET_AMOUNT      : String(10);
        TOTAL_AMOUNT    : String(10);
        CGST_PERC       : String(10);
        CGST_AMOUNT     : String(10);
        SGST_PERC       : String(10);
        SGST_AMOUNT     : String(10);
        IGST_PERC       : String(10);
        IGST_AMOUNT     : String(10);
        TAXES_AMOUNT    : String(10); //total tax amount

}

entity PR_TEMPLATE {

    key TEMPLATE_ID       : Integer;
        TEMPLATE_NAME     : String(100);

        @Core.ContentDisposition.Filename: TEMPLATE_NAME
        @Core.MediaType                  : TEMPLATE_MIMETYPE
        TEMPLATE_CONTENT  : LargeBinary;

        @Core.IsMediaType                : true
        TEMPLATE_MIMETYPE : String(100);
        TEMPLATE_TYPE     : String(100);

}

entity PR_EVENT_LOG {

    key PR_NO           : Integer64;
    key EVENT_NO        : Integer;
        EVENT_CODE      : String(10);
        USER_ID         : String(100);
        USER_ROLE       : String(10);
        USER_NAME       : String(100);
        COMMENTS        : String(100);
        CREATION_DATE   : Timestamp;
        TO_EVENT_STATUS : Association to one DEALER_PORTAL.MASTER_PR_EVENT
                              on TO_EVENT_STATUS.CODE = EVENT_CODE;

}

entity CLAIM_HEADER {

    key CR_NO              : Integer64;
        SAP_NO             : String(10);
        DISTRIBUTOR_ID     : String(10);
        DISTRIBUTOR_NAME   : String(100);
        CLAIM_TYPE         : Integer;
        CLAIM_DESC         : String(100);
        CLAIM_REASON       : String(100);
        CLAIM_FROM         : Date;
        CLAIM_TO           : Date;
        STATUS             : Integer;
        APPROVER_LEVEL     : Integer;
        APPROVER_ROLE      : String(20);
        // BU_CODE :
        SALES_ASSOCIATE_ID : String(500);
        REGION_CODE        : String(1);
        SAP_CREDIT_NOTE    : String(10);
        LAST_UPDATED       : Timestamp;
        CREATED_ON         : Timestamp;
        TO_STATUS          : Association to one DEALER_PORTAL.MASTER_CLAIM_STATUS
                                 on TO_STATUS.CODE = STATUS;
        TO_ITEMS           : Association to many CLAIM_ITEMS
                                 on TO_ITEMS.CR_NO = CR_NO;
        TO_ATTACHMENT      : Association to many CLAIM_ATTACHMENTS
                                 on TO_ATTACHMENT.CR_NO = CR_NO;
        TO_EVENT           : Association to many CLAIM_EVENT_LOG
                                 on TO_EVENT.CR_NO = CR_NO;

}

entity CLAIM_ITEMS {

    key CR_NO               : Integer64;
    key ITEM_NO             : Integer;
        ITEM_CODE           : String(30);
        ITEM_DESC           : String(200);
        UNIT_OF_MEASURE     : String(3);
        HOSPITAL_CODE       : Integer;
        INVOICE_NO          : Integer64;
        INVOICE_DATE        : Date;
        INVOICE_QUANTITY    : Integer;
        INVOICE_RATE        : Double;
        REQUESTED_RATE      : Double;
        REQUESTED_QUANTITY  : Integer;
        REQUESTED_AMOUNT    : Double;
        PROCESSSED_RATE     : Double;
        PROCESSSED_QUANTITY : Integer;
        PROCESSSED_AMOUNT   : Double;

}

entity CLAIM_ATTACHMENTS {

    key CR_NO         : Integer64;
        ATTACH_CODE   : Integer;
        FILE_ID       : Integer;
        FILE_NAME     : String(100);
        FILE_TYPE     : String(100);

        @Core.IsMediaType                : true
        FILE_MIMETYPE : String(100);

        @Core.ContentDisposition.Filename: FILE_NAME
        @Core.MediaType                  : FILE_MIMETYPE
        FILE_CONTENT  : LargeBinary;
        UPLOAD_DATE   : Timestamp;

}

entity CLAIM_EVENT_LOG {
    key CR_NO           : Integer64;
    key EVENT_NO        : Integer;
        EVENT_CODE      : Integer;
        USER_ID         : String(100);
        USER_NAME       : String(100);
        USER_ROLE       : String(50);
        REMARK          : String(200);
        COMMENT         : String(200);
        CREATION_DATE   : Timestamp;
        TO_EVENT_STATUS : Association to one DEALER_PORTAL.MASTER_CLAIM_EVENT
                              on TO_EVENT_STATUS.CODE = EVENT_CODE;
}

entity PAYMENTS_HEADER {

    key SAP_ORDER_NO               : String(10);
    key POP_NO                     : Integer64;
        DISTRIBUTOR_ID             : String(10);
        DISTRIBUTOR_NAME           : String(100);
        PR_SAP_NO                  : String(10);
        // BU_CODE : String(10);
        CREATION_DATE              : Timestamp;
        PAYMENT_TYPE               : String(100);
        //Full Payment
        OFFLINE_FP_UTR             : String(50);
        OFFLINE_FP_DATE            : Date;
        OFFLINE_FP_AMOUNT          : Double;
        //Partial Payment
        OFFLINE_PP_UTR             : String(50);
        OFFLINE_PP_DATE            : Date;
        OFFLINE_PP_UTR_AMT         : Double;
        OFFLINE_PP_CREDIT_NOTE_NO  : String(40);
        OFFLINE_PP_CREDIT_NOTE_AMT : Double;
        //Post Date Cheques
        PDC_NO                     : Integer64;
        PDC_DATE                   : Date;
        PDC_AMT                    : Double;
        //Exceptional credit
        EXCRDT_DAYS                : Integer;
        // LOC_NO : String(40);
        // LOC_DATE : Date;
        // LOC_AMT : Double;
        // LOC_LAST_DATE_DELIVERY : Date;
        DIST_COMMENTS              : String(100);
        PAY_NOW_UTR                : String(50);
        PAY_NOW_TRASAC_NO          : String(50);
        PAY_NOW_DATE               : Date;
        PAY_NOW_AMT                : Double;
        DOC_POST                   : String(1);
        ATTACH                     : String(1);
        STATUS                     : Integer;
        AR_AMOUNT_ENTERED          : Double;
        LAST_UPDATED_DATE          : Timestamp;
        APPROVER_LEVEL             : Integer;
        APPROVER_ROLE              : String(50);
        TO_STATUS                  : Association to one DEALER_PORTAL.MASTER_PAYMENT_STATUS
                                         on TO_STATUS.CODE = STATUS;
        TO_ATTACHMENT              : Association to many PAYMENTS_ATTACHMENTS
                                         on TO_ATTACHMENT.POP_NO = POP_NO;
        TO_EVENT                   : Association to many PAYMENTS_EVENT_LOG
                                         on TO_EVENT.POP_NO = POP_NO;
}

entity PAYMENTS_ATTACHMENTS {
    key POP_NO        : Integer64;
        ATTACH_CODE   : Integer;
    key FILE_ID       : Integer;

        @Core.ContentDisposition.Filename: FILE_NAME
        @Core.MediaType                  : FILE_MIMETYPE
        FILE_CONTENT  : LargeBinary;

        @Core.IsMediaType                : true
        FILE_MIMETYPE : String(100);
        FILE_TYPE     : String(100);
        FILE_NAME     : String(100);
        CREATION_DATE : Timestamp;
}

entity PAYMENTS_EVENT_LOG {

    key POP_NO          : Integer64;
    key EVENT_NO        : Integer;
        EVENT_CODE      : Integer;
        USER_ID         : String(100);
        USER_ROLE       : String(10);
        USER_NAME       : String(100);
        COMMENTS        : String(1000);
        CREATION_DATE   : Timestamp;
        TO_EVENT_STATUS : Association to one DEALER_PORTAL.MASTER_PAYMENT_EVENT
                              on TO_EVENT_STATUS.CODE = EVENT_CODE;
}

// shubham added
entity RGA_HEADER {

    key RGA_NO             : Integer64;
        DISTRIBUTOR_ID     : String(100);
        DISTRIBUTOR_NAME   : String(100);
        DISTRIBUTOR_REASON : String(100);
        STATUS             : Integer;
        APPROVER_LEVEL     : Integer;
        APPROVER_ROLE      : String(50);
        BU_CODE            : String(50);
        SAP_RETURN_CODE    : String(10);
        COMMENT            : String(200);
        CREATED_ON         : Timestamp;
        TO_STATUS          : Association to one DEALER_PORTAL.MASTER_RGA_STATUS
                                 on TO_STATUS.CODE = STATUS;
        RGA_ITEMS_REF      : Association to many DEALER_PORTAL.RGA_ITEMS
                                 on RGA_ITEMS_REF.RGA_NO = RGA_NO;
        TO_EVENT           : Association to many RGA_EVENT_LOGS
                                 on TO_EVENT.RGA_NO = RGA_NO;
}

entity RGA_ITEMS {

    key RGA_NO             : Integer64;
    key RGA_ITEM_NO        : Integer64;
        ITEM_CODE          : String(15);
        ITEM_DESCRIPTION   : String(1000);
        UNIT_OF_MEASURE    : String(3);
        BATCH              : String(15);
        EXPIRY_DATE        : Date;
        SALEABLE           : String(1);
        INVOICE_NO         : String(15);
        INVOICE_DATE       : Date;
        INVOICE_QUANTITY   : Integer;
        PRICE              : Double;
        EXTENDED           : Double;
        RETURN_QUANTITY    : Integer;
        ACCEPTED_QUANTITY  : Integer;
        ACCEPTED_PRICE     : Double
}

entity RGA_EVENT_LOGS {

    key RGA_NO             : Integer64;
    key EVENT_NO           : Integer;
        EVENT_CODE         : Integer;
        USER_ID            : String(100);
        USER_NAME          : String(50);
        USER_ROLE          : String(50);
        REMARK             : String(100);
        COMMENT            : String(100);
        CREATION_DATE      : Timestamp;
        TO_EVENT_STATUS    : Association to one DEALER_PORTAL.MASTER_RGA_EVENT_STATUS
                              on TO_EVENT_STATUS.CODE = EVENT_CODE;
}
// Shubham added
entity GRN_HEADER {

    key DISTRIBUTOR_ID     : String(100);
        DISTRIBUTOR_NAME   : String(100);
        DELIVERY_NO        : String(15);
    key INVOICE_NO         : String(15);
        INVOICE_DATE       : Date;
        DELIVERY_DATE      : Date;
        ACCEPTED_DATE      : Date;
        INVOICE_AMOUNT     : Double;
        STATUS             : Integer;
        SAP_ORDER_NO       : String(10);
        TO_ITEMS_REF       : Association to one DEALER_PORTAL.GRN_ITEMS
                              on TO_ITEMS_REF.INVOICE_NO = INVOICE_NO;
        TO_STATUS_REF      : Association to one DEALER_PORTAL.GRN_STATUS_MASTER
                               on TO_STATUS_REF.STATUS = STATUS;

}

entity GRN_ITEMS {
    key INVOICE_NO         : String(15);
    key ITEM_NO            : Integer;
        MATERIAL_GROUP     : String(50);
        MATERIAL_GROUP_DESC: String(100);
        MATERIAL_CODE      : String(50);
        MATERIAL_DESC      : String(100);
        BATCH              : String(10);
        EXPIRY_DATE        : Date; 
        HSN_CODE           : String(10);
        UNIT_OF_MEASURE    : String(3);
        UNIT_PRICE         : String(17);
        OPENING_STOCK      : String(10);
        QUANTITY           : Double;
        ACCEPTED_QUANTITY  : Double;
        REJECTED_QUANTITY  : Double;
        CGST_PERC          : String(10);
        CGST_AMOUNT        : String(10);
        SGST_PERC          : String(10);
        SGST_AMOUNT        : String(10);
        IGST_PERC          : String(10);
        IGST_AMOUNT        : String(10);
        TAX_AMOUNT         : String(17);
        TOTAL_AMOUNT       : String(17);

}

  entity GRN_STOCK {
       
   key  DISTRIBUTOR_ID     : String(100);
   key  MATERIAL_GROUP     : String(50);
        MATERIAL_GROUP_DESC: String(100);
   key  MATERIAL_CODE      : String(50);
        MATERIAL_DESC      : String(100); 
        UNIT_PRICE         : String(17);
        UPDATED_PRICE       : String(17);
      //   MARGIN_PERC        : Integer;
        MATERIAL_STOCK     : Integer;
        
        HSN_CODE           : String(10);
        UNIT_OF_MEASURE    : String(3);
        CGST_PERC          : String(10);
        SGST_PERC          : String(10);
        IGST_PERC          : String(10);
        UPDATED_DATE       : Timestamp;
        STATUS             : Integer;
        TO_STATUS_REF      : Association to one DEALER_PORTAL.GRN_STATUS_MASTER
                               on TO_STATUS_REF.STATUS = STATUS;

  }

entity GRN_EVENT_LOGS {

    key INVOICE_NO : String(15); 
    key EVENT_NO   : Integer;
        USER_ID    : String(100);
        USER_NAME  : String(50);
        USER_ROLE  : String(50);
        COMMENT    : String(200);
        CREATED_ON : Timestamp;

}
// Shubham Added
 entity RETAILER_PAYMENTS {

    key SRNO                     : Integer64;
    key DISTRIBUTOR_ID           : String(10);
    key SO_NO                    : String(10);
    key RETAILER_ID              : String(10);
    key DELIVERY_NO              : String(10);
    key INVOICE_NO               : String(10);
        RETAILER_NAME            : String(50);
        INVOICE_DATE             : Date;
        INVOICE_AMOUNT           : String(20);
        INVOICE_BAL_AMOUNT       : String(20);
        OUTSTANDING_AMOUNT       : String(20);
        YOUR_AMOUNT              : Double;
        BANK_NAME                : String(20);
        TRANSACTION_ID           : String(30); 
        TOTAL_INV_BALANCE_AMOUNT : Double; 
        
        DEPOSIT_DATE             : Date;
        PAYMENT_STATUS           : Integer;
        PAYMENT_STATUS_REF       : Association to one DEALER_PORTAL.PAYMENT_ENTRY_STATUS_MASTER
                                   on PAYMENT_STATUS_REF.PAYMENT_STATUS = PAYMENT_STATUS;
   }

    entity RETAILER_PAYMENT_EVENT_LOGS {
    
    key SR_NO       : Integer;
    key SO_NO       : String(10);
    key INVOICE_NO  : String(15);
    key DELIVERY_NO : String(10);
        USER_ID     : String(100);
        USER_NAME   : String(50);
        USER_ROLE   : String(50);
        COMMENT     : String(200);
        CREATED_ON  : Timestamp;
   }

   entity CREDIT_DEBIT_TRANSACTION {
      
    key DISTRIBUTOR_ID     : String(10);
    key RETAILER_ID        : String(10);
    key TX_ID              : Integer64;
        TRANSACTION_TYPE   : String(20);
        POSTING_DATE       : Date;
        REFERENCE_INVOICE  : String(15);
        INVOICE_AMOUNT     : String(20);
        REFERENCE_TEXT     : String(200);
        AMOUNT             : String(20);
        TAX_AMOUNT         : String(20);
        TOTAL_AMOUNT       : String(20);
        CREATED_ON         : Timestamp; 

   }


    //aniket added on 21/06/2024
   entity PPR_HEADER {

    key PPR_NO  : Integer64;
    key PROD_GRP : String(100);
    key DISTRIBUTOR_ID     : String(100);
        DISTRIBUTOR_NAME   : String(100);
    PROD_CODE : String(100);
    PROD_UNKNOWN : String(1);
    key FACTORY_NAME : String(100);
    DESCRIPTION : String(100);
    STATUS : Integer;
    SALES_ASSOCIATE_ID : String(100);
    APPROVER_ROLE : String(100);
    APPROVER_LEVEL : Integer;
    CREATED_ON : Timestamp;
    TO_STATUS  : Association to one DEALER_PORTAL.MASTER_PPR_STATUS
                 on TO_STATUS.CODE = STATUS;
    TO_ATTACHMENT : Association to many PPR_ATTACHMENT
                    on TO_ATTACHMENT.PPR_NO = PPR_NO;
    TO_EVENT : Association to many PPR_EVENTS
                on TO_EVENT.PPR_NO = PPR_NO;

   }

   entity PPR_ATTACHMENT{

    key PPR_NO : Integer64;
    ATTACH_CODE : Integer;
    key FORM_ID : Integer;
    key FILE_ID : Integer;
    FILE_NAME : String(100);
    FILE_TYPE : String(100);
    @Core.IsMediaType                : true
    FILE_MIMETYPE : String(100);
    @Core.ContentDisposition.Filename: FILE_NAME
    @Core.MediaType                  : FILE_MIMETYPE
    FILE_CONTENT : LargeBinary;
    UPLOAD_DATE : Timestamp;

   }

   entity PPR_EVENTS{

    key PPR_NO : Integer64;
    key EVENT_NO : Integer;
    EVENT_CODE : Integer;
    USER_NAME : String(100);
    USER_ROLE : String(100);
    USER_ID : String(100);
    REMARK : String(100);
    COMMENT : String(200);
    CREATION_DATE : Timestamp;
    TO_STATUS  : Association to one DEALER_PORTAL.MASTER_PPR_EVENT_STATUS
                on TO_STATUS.CODE = EVENT_CODE;

   }

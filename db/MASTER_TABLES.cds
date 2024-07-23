// using { DEALER_PORTAL.MASTER_ENTITY_CODE } from '../db/MASTER_TABLES';
using {
    cuid,
    managed
} from '@sap/cds/common';
// using {cuid} from '@sap/cds/common';DEALER_PORTAL_MATERIAL_GROUP_MASTER

context DEALER_PORTAL {

    entity MASTER_ENTITY_AND_TYPE : cuid, managed {
        TYPE                         : String(20) @mandatory;
        ENTITY_CODE                  : String(10) @mandatory;
        TO_ENTITY_CODE               : Association to one MASTER_ENTITY_CODE
                                           on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;
        TO_REQUEST_CODE              : Association to one MASTER_APPROVAL_TYPES
                                           on TO_REQUEST_CODE.CODE = TYPE;
        TO_MASTER_APPROVAL_HIERARCHY : Composition of many MASTER_APPROVAL_HIERARCHY
                                           on TO_MASTER_APPROVAL_HIERARCHY.TO_ENTITY_HIERARCHY = $self;

    }

    entity MASTER_APPROVAL_HIERARCHY : cuid, managed {
        ENTITY_CODE         : String(10) @readonly;
        LEVEL               : Integer    @readonly;
        ROLE_CODE           : String(20) @mandatory;
        USER_IDS            : String     @mandatory;
        TYPE                : String(20) @readonly;
        ACCESS_EDIT         : Boolean default false;
        ACCESS_APPROVE      : Boolean default false;
        ACCESS_SENDBACK     : Boolean default false;
        ACCESS_REJECT       : Boolean default false;
        ACCESS_HOLD       : Boolean default false;
        TO_ROLE_DESC        : Association to one MASTER_USER_ROLE
                                  on TO_ROLE_DESC.CODE = ROLE_CODE;
        TO_ENTITY_HIERARCHY : Association to MASTER_ENTITY_AND_TYPE;

    }

    entity MASTER_APPROVAL_TYPES {
        key CODE : String(10);
            DESC : String(50);
    }

    //old tables
    // entity ENTITY_AND_TYPE : cuid,managed{
    //     TYPE : String(10) @readonly;
    //     ENTITY_CODE : String(10) @readonly;
    //     TO_MASTER_APPROVAL_HIERARCHY : Composition of many MASTER_APPROVAL_HIERARCHY on
    //                                     TO_MASTER_APPROVAL_HIERARCHY.TO_ENTITY_HIERARCHY = $self;
    //     TO_MASTER_APPROVAL_MATRIX : Composition of many MASTER_APPROVAL_MATRIX on
    //                                     TO_MASTER_APPROVAL_MATRIX.TO_ENTITY_MATRIX = $self;

    // }

    // entity MASTER_APPROVAL_HIERARCHY: cuid,managed{
    //     HIERARCHY_ID : String(10) @readonly;
    //     ENTITY_CODE : String(10) @readonly;
    //     LEVEL : Integer @readonly;
    //     ROLE_CODE : String(10) @mandatory;
    //     TYPE : String(10) @readonly;
    //     ACCESS_EDIT : Boolean;
    //     ACCESS_APPROVE : Boolean;
    //     ACCESS_SENDBACK : Boolean;
    //     ACCESS_REJECT : Boolean;
    //     TO_ENTITY_CODE : Association to one MASTER_ENTITY_CODE
    //                     on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;
    //     TO_ENTITY_HIERARCHY : Association to ENTITY_AND_TYPE;

    // }

    // entity MASTER_APPROVAL_MATRIX: cuid,managed{
    //     HIERARCHY_ID : String(10) @readonly;
    //     USER_IDS : String @mandatory;
    //     TYPE : String(10) @readonly;
    //     TO_ENTITY_MATRIX : Association to ENTITY_AND_TYPE;
    // }

    // entity MASTER_APPROVAL_HIERARCHY{
    //     key HIERARCHY_ID : String(10);
    //     ENTITY_CODE : String(10);
    //     LEVEL : Integer;
    //     ROLE_CODE : String(10);
    //     key TYPE : String(10);
    //     ACCESS_EDIT : String(1);
    //     ACCESS_APPROVE : String(1);
    //     ACCESS_SENDBACK : String(1);
    //     ACCESS_REJECT : String(1);
    //     TO_ENTITY_CODE : Association to one MASTER_ENTITY_CODE
    //                     on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;

    // }

    // entity MASTER_APPROVAL_MATRIX{
    //     key HIERARCHY_ID : String(10);
    //     USER_IDS : String(1000);
    //     key TYPE : String(10);
    // }

    entity MASTER_USER_ROLE {
        key CODE        : String(25);
            DESCRIPTION : String(100);
    }

    entity MASTER_TABLENAMES {
        key SR_NO             : Integer;
            TABLE_CODE        : String(25) not null;
            TABLE_NAME        : String(50) not null;
            TABLE_TYPE        : String(25) not null;
            COLUMN_COUNT      : Integer not null;
            TABLE_DESCRIPTION : String(100);
            PRIMARY_KEY       : String(300);
    }

    entity MASTER_COUNTRY {
        key LAND1 : String(3);
        key LANDX : String(15);
        key NATIO : String(25);
    }

    entity MASTER_REGION {
        key LAND1 : String(3);
        key BLAND : String(3);
        key BEZEI : String(20);
    }

    entity MASTER_CURRENCY {

        key WAERS : String(5);
            LTEXT : String(40);

    }

    entity MASTER_TELECODE {
        key LAND1      : String(3);
            TELEFTO    : String(4);
            TO_COUNTRY : Association to one MASTER_COUNTRY
                             on TO_COUNTRY.LAND1 = LAND1;
    }

    entity MASTER_ENTITY_CODE {

        key BUKRS : String(4);
            BUTXT : String(50);
            ORT01 : String(25);
            WAERS : String(5);

    }

    entity MASTER_ATTACHMENT_TYPES {
        key CODE              : Integer not null;
            DESCRIPTION       : String(100);
            SHORT_DESCRIPTION : String(10);
            TYPE              : String(10);
            GROUP1            : String(10);
            GROUP2            : String(10); // Table group
    }

    entity MASTER_IAS_USER {

        key USER_ID      : String(50);
            STATUS       : String(50);
            LOGIN        : String(50);
        key EMAIL        : String(150) @Communication.IsEmailAddress;
            FIRST_NAME   : String(250);
            LAST_NAME    : String(250);
            COMPANY_CODE : String(100);
            EMP_NO       : String(100);
            MOBILE_NO    : String(15)  @Communication.IsPhoneNumber;

    }

    entity MASTER_IBAN_COUNTRY {
        key LAND1  : String(3);
        key LANDX  : String(25);
        key LENGTH : Integer
    }

    entity MASTER_IDEAL_SETTINGS {
        key CODE        : String(25);
            DESCRIPTION : String(100);
            SETTING     : String(100);
            TYPE        : String(10)
    }

    entity MASTER_REGEX_POSTALCODE {
        key LAND1     : String(3);
            REGEX     : String(250);
            REGEX_EXP : String(250);
    }

    entity MASTER_IDEAL_ATTACHMENTS {
        key SR_NO            : Integer;
        key ENTITY_CODE      : String(10);
        key ATTACH_CODE      : Integer;
            ATTACH_GROUP     : String(30);
            ATTACH_DESC      : String(100);
            FILE_NAME        : String(100);
            FILE_TYPE        : String(100);
            FILE_MIMETYPE    : String(100);
            FILE_CONTENT     : LargeBinary;
            UPLOADED_ON      : Timestamp;
            ATTACH_TYPE_CODE : String(10);
            ATTACH_TYPE_DESC : String(100);
    }

    entity MASTER_STATUS {
        key CODE        : Integer;
            DESCRIPTION : String(50);
    }

    entity MASTER_REQUEST_TYPE {
        key CODE          : Integer;
            DESCRIPTION   : String(50);
            SUPPLIER_TYPE : String(50);
    }

    entity MASTER_REQUEST_EVENTS {
        key CODE        : Integer;
            DESCRIPTION : String(50);
            TYPE        : String(25);
    }

    entity MASTER_REGFORM_FIELDS_ID_DESC {

        key FIELDS      : String(15);
            DESCRIPTION : String(500);
            CATEGORY    : String(50);
            SECTION     : String(50);

    }

    //request approval matrix
    entity MATRIX_REQUEST_APPR {

        key APPROVER_LEVEL : Integer;
        key USER_ROLE      : String(10);
        key USER_ID        : String(100);
        key ENTITY_CODE    : String(50);
            // key ENTITY_DESC : String(100);
            TO_USER_ROLE   : Association to one MASTER_USER_ROLE
                                 on TO_USER_ROLE.CODE = USER_ROLE;
            TO_ENTITY_CODE : Association to one MASTER_ENTITY_CODE
                                 on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;
    }

    // registration approval matrix
    entity MATRIX_REGISTRATION_APPR {

        key APPROVER_LEVEL : Integer;
        key USER_ROLE      : String(10);
        key USER_ID        : String(100);
        key ENTITY_CODE    : String(10);
            TO_USER_ROLE   : Association to one MASTER_USER_ROLE
                                 on TO_USER_ROLE.CODE = USER_ROLE;
            TO_ENTITY_CODE : Association to one MASTER_ENTITY_CODE
                                 on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;
    }

    //user master
    //make user_role as key for SA/CM access
    entity MASTER_IDEAL_USERS {
        key SR_NO            : Integer;
            USER_ID          : String(50);
        key USER_ROLE        : String(50);
            USER_NAME        : String(500);
        key EMAIL            : String(150);
            COMPANY_CODE     : String(500);
            EMP_NO           : String(100);
            CREATED_ON       : Timestamp;
            UPDATED_ON       : Timestamp;
            ACTIVE           : String(1);
            TO_USER_ROLE     : Association to one MASTER_USER_ROLE
                                   on TO_USER_ROLE.CODE = USER_ROLE;
            TO_ENTITY_CODE   : Association to one MASTER_ENTITY_CODE
                                   on TO_ENTITY_CODE.BUKRS = COMPANY_CODE;
            TO_USER_ENTITIES : Association to many MASTER_USER_ENTITY_CODES
                                   on TO_USER_ENTITIES.USER_ID = USER_ID;
    }

    entity MASTER_USER_ENTITY_CODES {
        key USER_ID     : String(50);
        key USER_ROLE   : String(50);
        key ENTITY_CODE : String(50);
            EMAIL       : String(150);
            ENTITY_DESC : String(100);
    }

    entity MASTER_CREDENTIAL {
        key SR_NO      : Integer;
            USERNAME   : String(100);
            PASSWORD   : String(100);
            TYPE       : String(100);
            ADD_INFO1  : String(100);
            ADD_INFO2  : String(100);
            ADD_INFO3  : String(100);
            CREATED_ON : Timestamp;
    }

    entity MASTER_ADDRESS_TYPE {
        key CODE : String(10);
            DESC : String(30);
    }

    entity MASTER_EMAIL_CONTACT_ID {

        key SR_NO             : Integer;
            EMAIL_NOTIF_1     : String(100);
            EMAIL_NOTIF_2     : String(100);
            EMAIL_NOTIF_3     : String(100);
            CONTACT_ID_1      : String(100);
            CONTACT_ID_2      : String(100);
            CONTACT_ID_3      : String(100);
            CLIENT_FULL_NAME  : String(100);
            CLIENT_SHORT_NAME : String(100);
            CLIENT_COUNTRY    : String(100);
            EMAIL_CC          : String(1000);

    }

    entity MASTER_IDEAL_SAP_DEALER_NO {
            // REG_NO : Integer64;
            SAP_DIST_CODE   : String(10);
        key IDEAL_DIST_CODE : Integer64;
            ACCOUNT_GROUP   : String(50)
    }

    entity MASTER_SAP_CLIENT {
        key SR_NO       : Integer;
            CLIENT      : Integer not null;
            DESTINTAION : String(25) not null;
    }

    entity MASTER_SUBACCOUNT {
        key SR_NO       : Integer;
            SUBACCOUNT  : String(50) not null;
            PORTAL_LINK : String(100);
    // DM_LIMIT : Integer;
    }

    entity MASTER_SALES {
            // KUNNR : String;
        key ENTITY_CODE  : String;
        key EMPNO        : String;
            DESIGNATION  : String;
            NAME         : String;
            PHONE        : String;
            EMAIL        : String;
            DIVISION     : String;
            ROLE         : String;
            DIVISIONCODE : String;
            DESIGN_CODE  : String;
    }

    entity MASTER_FINANCE {
            // KUNNR : String;
        key ENTITY_CODE  : String;
        key EMPNO        : String;
            DESIGNATION  : String;
            NAME         : String;
            PHONE        : String;
            EMAIL        : String;
            DIVISION     : String;
            ROLE         : String;
            DIVISIONCODE : String;
    }

    entity MASTER_SERVICE {
            // KUNNR : String;
        key ENTITY_CODE  : String;
        key EMPNO        : String;
            DESIGNATION  : String;
            NAME         : String;
            PHONE        : String;
            EMAIL        : String;
            DIVISION     : String;
            ROLE         : String;
            DIVISIONCODE : String;
            DESIGN_CODE  : String;
    }

    entity MASTER_LOGISTICS {
            // KUNNR : String;
        key ENTITY_CODE  : String;
        key EMPNO        : String;
            DESIGNATION  : String;
            NAME         : String;
            PHONE        : String;
            EMAIL        : String;
            DIVISION     : String;
            ROLE         : String;
            DIVISIONCODE : String;
            DESIGN_CODE  : String;
    }

    entity EMAIL_CONFIG {
        key SR_NO        : Integer;
            HOST         : String(100);
            PORT         : Integer;
            SECURE       : Boolean;
            SENDER_EMAIL : String(100);
            USERNAME     : String(100);
            PASSWORD     : String(100);
            CREATED_ON   : Timestamp;
    }

    entity MASTER_SO_STATUS {
        key CODE : Integer;
            DESC : String(100);
    }

    entity MASTER_PR_EVENT {
        key CODE : Integer;
            DESC : String(100);
    }

    entity MASTER_PR_STATUS {
        key CODE : Integer;
            DESC : String(100);
    }

    entity MASTER_CLAIM_EVENT{
         key CODE : Integer;
            DESC : String(100);
    }
    entity MASTER_CLAIM_STATUS{
         key CODE : Integer;
            DESC : String(100);
    }

    entity MASTER_CLAIM_TYPE{
        key CODE : Integer;
            DESC : String(100);
    }

    entity MASTER_PAYMENT_STATUS{
         key CODE : Integer;
            DESC : String(100);
    }

    entity MASTER_PAYMENT_EVENT{
         key CODE : Integer;
            DESC : String(100);
    }   

// shubham
entity MASTER_RGA_STATUS {
   key CODE : Integer;
       DESC : String(100);
 
}

entity MASTER_RGA_EVENT_STATUS {
   key CODE : Integer;
       DESC : String(100);
}


entity GRN_STATUS_MASTER {
    key STATUS         : Integer;
    STATUS_DESCRIPTION : String(20);
}

entity MATERIAL_GROUP_MASTER {
    key MATERIAL_GROUP      : String(50);
        MATERIAL_GROUP_DESC : String(100);
}

entity MATERIAL_CODE_MASTER {
    key MATERIAL_GROUP : String(50);
    key MATERIAL_CODE  : String(50);
        MATERIAL_DESC  : String(100);
}

entity PAYMENT_ENTRY_STATUS_MASTER {
    key PAYMENT_STATUS : Integer;
    STATUS_DESCRIPTION : String(20);
}

entity MASTER_PPR_STATUS {
        key CODE : Integer;
            DESC : String(100);
    }

entity MASTER_PPR_EVENT_STATUS {
        key CODE : Integer;
            DESC : String(100);
    }

entity MASTER_CREDIT_DEBIT_TX{
        key CODE       : String(10);
            DESCRIPTION: String(20);
}
 

    entity MASTER_REGFORM_FIELDS_CONFIG {
        key CCODE     : String(10);
        key REQ_TYPE  : Integer;
        key TYPE      : String(1);
            // Section 1 - General Section
            // Group 1 - General Information
            S1G1T1F1  : String(1);
            S1G1T1F2  : String(1);
            S1G1T1F3  : String(1);
            S1G1T1F4  : String(1);
            S1G1T1F5  : String(1);
            S1G1T1F6  : String(1);
            S1G1T1F7  : String(1);
            S1G1T1F8  : String(1);
            // Section 1 - General Section
            // Group 2 - Distributor Address
            S1G2T1F1  : String(1);
            S1G2T1F2  : String(1);
            S1G2T1F3  : String(1);
            S1G2T1F4  : String(1);
            S1G2T1F5  : String(1);
            S1G2T1F6  : String(1);
            S1G2T1F7  : String(1);
            S1G2T1F8  : String(1);
            S1G2T1F9  : String(1);
            S1G2T1F10 : String(1);
            S1G2T1F11 : String(1);
            // Section 1 - General Section
            // Group 3 - Other Office Address
            S1G3T1F1  : String(1);
            S1G3T1F2  : String(1);
            S1G3T1F3  : String(1);
            S1G3T1F4  : String(1);
            S1G3T1F5  : String(1);
            S1G3T1F6  : String(1);
            S1G3T1F7  : String(1);
            S1G3T1F8  : String(1);
            S1G3T1F9  : String(1);
            S1G3T1F10 : String(1);
            S1G3T1F11 : String(1);
            S1G3T1F12 : String(1);
            S1G3T1F13 : String(1);
            // Section 1 - General Section
            // Group 4 - Contact information
            S1G4T1F1  : String(1);
            S1G4T1F2  : String(1);
            S1G4T1F3  : String(1);
            S1G4T1F4  : String(1);
            S1G4T1F5  : String(1);
            S1G4T1F6  : String(1);
            S1G4T1F7  : String(1);
            S1G4T1F8  : String(1);
            S1G4T1F9  : String(1);
            S1G4T1F10 : String(1);
            S1G4T1F11 : String(1);
            // Section 1 - General Section
            // Group 5 - Other Contact information
            S1G5T2F1  : String(1);
            S1G5T2F2  : String(1);
            S1G5T2F3  : String(1);
            S1G5T2F4  : String(1);
            S1G5T2F5  : String(1);
            S1G5T2F6  : String(1);
            S1G5T2F7  : String(1);
            S1G5T2F8  : String(1);
            S1G5T2F9  : String(1);
            // S1G5T2F10 : String(1);
            S1G5T2F11 : String(1);
            S1G5T2F12 : String(1);
            S1G5T2F13 : String(1);
            // Section 1 - General Section
            // Group 6 - Additional Information
            S1G6T1F1  : String(1);
            S1G6T1F2  : String(1);
            S1G6T1F3  : String(1);
            S1G6T1F4  : String(1);
            S1G6T1F5  : String(1);
            S1G6T1F6  : String(1);
            // Section 1 - General Section
            // Group 7 - Employee Details
            S1G7T1F1  : String(1);
            S1G7T1F2  : String(1);
            S1G7T1F3  : String(1);
            S1G7T1F4  : String(1);
            S1G7T1F5  : String(1);
            S1G7T1F6  : String(1);
            S1G7T1F7  : String(1);
            S1G7T1F8  : String(1);
            S1G7T1F9  : String(1);
            S1G7T1F10 : String(1);
            S1G7T1F11 : String(1);
            // Section 2 - Financial Section
            // Group 1 - Financial Information
            S2G1T1F1  : String(1);
            S2G1T1F2  : String(1);
            S2G1T1F3  : String(1);
            S2G1T1F4  : String(1);
            S2G1T1F5  : String(1);
            S2G1T1F6  : String(1);
            S2G1T1F7  : String(1);
            S2G1T1F8  : String(1);
            S2G1T1F9  : String(1);
            S2G1T1F10 : String(1);
            // S2G1T1F11: String(1);
            // S2G1T1F12: String(1);
            // S2G1T1F13: String(1);
            S2G1T1F11 : String(1);
            S2G1T1F12 : String(1);
            // Section 2 - Financial Section
            // Group 2 - Other Bank Details
            S2G2T1F1  : String(1);
            S2G2T1F2  : String(1);
            S2G2T1F3  : String(1);
            S2G2T1F4  : String(1);
            S2G2T1F5  : String(1);
            S2G2T1F6  : String(1);
            S2G2T1F7  : String(1);
            S2G2T1F8  : String(1);
            S2G2T1F9  : String(1);
            S2G2T1F10 : String(1);
            S2G2T1F12 : String(1);
            S2G2T1F13 : String(1);
            // S2G2T1F11: String(1);
            // S2G2T1F12: String(1);
            // S2G2T1F13: String(1);
            S2G2T1F14 : String(1);
            // Section 2 - Financial Section
            // Group 2 - Other Bank Details
            //Type 2 - VAT Details
            S2G2T2F1  : String(1);
            S2G2T2F2  : String(1);
            S2G2T2F3  : String(1);
            S2G2T2F4  : String(1);
            // Section 2 - Financial Section
            // Group 2 - Other Bank Details
            //Type 3 - ICV Details
            S2G2T3F1  : String(1);
            S2G2T3F2  : String(1);
            //Section 3 - Financial Section
            // Group 3 - Banking Details
            //Type 1 - Banking Details
            S2G3T1F1  : String(1);
            S2G3T1F2  : String(1);
            S2G3T1F3  : String(1);
            S2G3T1F4  : String(1);
            S2G3T1F5  : String(1);
            S2G3T1F6  : String(1);
            S2G3T1F7  : String(1);
            // Section 3 - Operational Section
            // Group 1 - Business History Details
            S3G1T1F1  : String(1);
            S3G1T1F2  : String(1);
            S3G1T1F3  : String(1);
            S3G1T1F4  : String(1);
            S3G1T1F5  : String(1);
            S3G1T1F6  : String(1);
            S3G1T1F7  : String(1);
            S3G1T1F8  : String(1);
            // Section 3 - Operational Section
            // Group 2 - Customer Details
            S3G2T1F1  : String(1);
            S3G2T1F2  : String(1);
            S3G2T1F3  : String(1);
            S3G2T1F4  : String(1);
            S3G2T1F5  : String(1);
            S3G2T1F6  : String(1);
            // Section 3 - Operational Section
            // Group 3 - Promoter/Management Details
            S3G3T1F1  : String(1);
            S3G3T1F2  : String(1);
            S3G3T1F3  : String(1);
            S3G3T1F4  : String(1);
            S3G3T1F5  : String(1);
            S3G3T1F6  : String(1);
            S3G3T1F7  : String(1);
            S3G3T1F8  : String(1);
            S3G3T1F9  : String(1);
            // Section 4 - Attachment Section
            // Attachment 1 - Company Profile
            S4A1F1    : String(1);
            // Attachment 2 - Distributor Document
            S4A2F1    : String(1);
            // Attachment 3 - Bank Account letter issued by the Bank (In Bank's letterhead)
            S4A3F1    : String(1);
            // Attachment 4 - TRN Certificate (Tax Registration Number)
            S4A4F1    : String(1);
            // Attachment 5 - ISO Certificate
            S4A5F1    : String(1);
            //PAN Certificate
            S4A6F1    : String(1);
            //Upload Disclosure Form
            S4A7F1    : String(1);
            //GST Certificate
            S4A8F1    : String(1);
            //License Certificate
            S4A9F1    : String(1);
            //Other certificates
            S4A10F1   : String(1);
            //Attachment Details
            S4A11F1   : String(1);
            //Section 5 - Submission page
            S5G1F1    : String(1);
            S5G1F2    : String(1);
            S5G1F3    : String(1);
            S5G1F4    : String(1);

    }

    entity MASTER_REGFORM_FIELDS_UPDATED {
        key REQ_NO    : Int64 not null;
            // Section 1 - General Section
            // Group 1 - General Information
            S1G1T1F1  : String(1);
            S1G1T1F2  : String(1);
            S1G1T1F3  : String(1);
            S1G1T1F4  : String(1);
            S1G1T1F5  : String(1);
            S1G1T1F6  : String(1);
            S1G1T1F7  : String(1);
            S1G1T1F8  : String(1);
            // Section 1 - General Section
            // Group 2 - Distributor Address
            S1G2T1F1  : String(1);
            S1G2T1F2  : String(1);
            S1G2T1F3  : String(1);
            S1G2T1F4  : String(1);
            S1G2T1F5  : String(1);
            S1G2T1F6  : String(1);
            S1G2T1F7  : String(1);
            S1G2T1F8  : String(1);
            S1G2T1F9  : String(1);
            S1G2T1F10 : String(1);
            S1G2T1F11 : String(1);
            // Section 1 - General Section
            // Group 3 - Other Office Address
            S1G3T1F1  : String(1);
            S1G3T1F2  : String(1);
            S1G3T1F3  : String(1);
            S1G3T1F4  : String(1);
            S1G3T1F5  : String(1);
            S1G3T1F6  : String(1);
            S1G3T1F7  : String(1);
            S1G3T1F8  : String(1);
            S1G3T1F9  : String(1);
            S1G3T1F10 : String(1);
            S1G3T1F11 : String(1);
            S1G3T1F12 : String(1);
            S1G3T1F13 : String(1);
            // Section 1 - General Section
            // Group 4 - Contact information
            S1G4T1F1  : String(1);
            S1G4T1F2  : String(1);
            S1G4T1F3  : String(1);
            S1G4T1F4  : String(1);
            S1G4T1F5  : String(1);
            S1G4T1F6  : String(1);
            S1G4T1F7  : String(1);
            S1G4T1F8  : String(1);
            S1G4T1F9  : String(1);
            S1G4T1F10 : String(1);
            S1G4T1F11 : String(1);
            // Section 1 - General Section
            // Group 5 - Other Contact information
            S1G5T2F1  : String(1);
            S1G5T2F2  : String(1);
            S1G5T2F3  : String(1);
            S1G5T2F4  : String(1);
            S1G5T2F5  : String(1);
            S1G5T2F6  : String(1);
            S1G5T2F7  : String(1);
            S1G5T2F8  : String(1);
            S1G5T2F9  : String(1);
            // S1G5T2F10 : String(1);
            S1G5T2F11 : String(1);
            S1G5T2F12 : String(1);
            S1G5T2F13 : String(1);
            // Section 1 - General Section
            // Group 6 - Additional Information
            S1G6T1F1  : String(1);
            S1G6T1F2  : String(1);
            S1G6T1F3  : String(1);
            S1G6T1F4  : String(1);
            S1G6T1F5  : String(1);
            S1G6T1F6  : String(1);
            // Section 1 - General Section
            // Group 7 - Employee Details
            S1G7T1F1  : String(1);
            S1G7T1F2  : String(1);
            S1G7T1F3  : String(1);
            S1G7T1F4  : String(1);
            S1G7T1F5  : String(1);
            S1G7T1F6  : String(1);
            S1G7T1F7  : String(1);
            S1G7T1F8  : String(1);
            S1G7T1F9  : String(1);
            S1G7T1F10 : String(1);
            S1G7T1F11 : String(1);
            // Section 2 - Financial Section
            // Group 1 - Financial Information
            S2G1T1F1  : String(1);
            S2G1T1F2  : String(1);
            S2G1T1F3  : String(1);
            S2G1T1F4  : String(1);
            S2G1T1F5  : String(1);
            S2G1T1F6  : String(1);
            S2G1T1F7  : String(1);
            S2G1T1F8  : String(1);
            S2G1T1F9  : String(1);
            S2G1T1F10 : String(1);
            // S2G1T1F11: String(1);
            // S2G1T1F12: String(1);
            // S2G1T1F13: String(1);
            S2G1T1F11 : String(1);
            S2G1T1F12 : String(1);
            // Section 2 - Financial Section
            // Group 2 - Other Bank Details
            S2G2T1F1  : String(1);
            S2G2T1F2  : String(1);
            S2G2T1F3  : String(1);
            S2G2T1F4  : String(1);
            S2G2T1F5  : String(1);
            S2G2T1F6  : String(1);
            S2G2T1F7  : String(1);
            S2G2T1F8  : String(1);
            S2G2T1F9  : String(1);
            S2G2T1F10 : String(1);
            S2G2T1F12 : String(1);
            S2G2T1F13 : String(1);
            // S2G2T1F11: String(1);
            // S2G2T1F12: String(1);
            // S2G2T1F13: String(1);
            S2G2T1F14 : String(1);
            // Section 2 - Financial Section
            // Group 2 - Other Bank Details
            //Type 2 - VAT Details
            S2G2T2F1  : String(1);
            S2G2T2F2  : String(1);
            S2G2T2F3  : String(1);
            S2G2T2F4  : String(1);
            // Section 2 - Financial Section
            // Group 2 - Other Bank Details
            //Type 3 - ICV Details
            S2G2T3F1  : String(1);
            S2G2T3F2  : String(1);
            //Section 3 - Financial Section
            // Group 3 - Banking Details
            //Type 1 - Banking Details
            S2G3T1F1  : String(1);
            S2G3T1F2  : String(1);
            S2G3T1F3  : String(1);
            S2G3T1F4  : String(1);
            S2G3T1F5  : String(1);
            S2G3T1F6  : String(1);
            S2G3T1F7  : String(1);
            // Section 3 - Operational Section
            // Group 1 - Business History Details
            S3G1T1F1  : String(1);
            S3G1T1F2  : String(1);
            S3G1T1F3  : String(1);
            S3G1T1F4  : String(1);
            S3G1T1F5  : String(1);
            S3G1T1F6  : String(1);
            S3G1T1F7  : String(1);
            S3G1T1F8  : String(1);
            // Section 3 - Operational Section
            // Group 2 - Customer Details
            S3G2T1F1  : String(1);
            S3G2T1F2  : String(1);
            S3G2T1F3  : String(1);
            S3G2T1F4  : String(1);
            S3G2T1F5  : String(1);
            S3G2T1F6  : String(1);
            // Section 3 - Operational Section
            // Group 3 - Promoter/Management Details
            S3G3T1F1  : String(1);
            S3G3T1F2  : String(1);
            S3G3T1F3  : String(1);
            S3G3T1F4  : String(1);
            S3G3T1F5  : String(1);
            S3G3T1F6  : String(1);
            S3G3T1F7  : String(1);
            S3G3T1F8  : String(1);
            S3G3T1F9  : String(1);
            // Section 4 - Attachment Section
            // Attachment 1 - Company Profile
            S4A1F1    : String(1);
            // Attachment 2 - Distributor Document
            S4A2F1    : String(1);
            // Attachment 3 - Bank Account letter issued by the Bank (In Bank's letterhead)
            S4A3F1    : String(1);
            // Attachment 4 - TRN Certificate (Tax Registration Number)
            S4A4F1    : String(1);
            // Attachment 5 - ISO Certificate
            S4A5F1    : String(1);
            //PAN Certificate
            S4A6F1    : String(1);
            //Upload Disclosure Form
            S4A7F1    : String(1);
            //GST Certificate
            S4A8F1    : String(1);
            //License Certificate
            S4A9F1    : String(1);
            //Other certificates
            S4A10F1   : String(1);
            //Attachment Details
            S4A11F1   : String(1);
            //Section 5 - Submission page
            S5G1F1    : String(1);
            S5G1F2    : String(1);
            S5G1F3    : String(1);
            S5G1F4    : String(1);

    }




}

@cds.persistence.exists
@cds.persistence.calcview
entity USERMASTER_ENTITIES {
    key USER_NAME    : String(500) @title: 'USER_NAME: USER_NAME';
        EMAIL        : String(150) @title: 'EMAIL: EMAIL';
        COMPANY_CODE : String(500) @title: 'COMPANY_CODE: COMPANY_CODE';
        CREATED_ON   : Timestamp   @title: 'CREATED_ON: CREATED_ON';
        ACTIVE       : String(1)   @title: 'ACTIVE: ACTIVE';
        ENTITY_CODE  : String(50)  @title: 'ENTITY_CODE: ENTITY_CODE';
        ENTITY_DESC  : String(100) @title: 'ENTITY_DESC: ENTITY_DESC';
        USER_ID      : String(50)  @title: 'USER_ID: USER_ID';
        USER_ROLE    : String(50)  @title: 'USER_ROLE: USER_ROLE';
}

// @cds.persistence.exists
// @cds.persistence.calcview
// Entity CALC_HIERARCHY_MATRIX {
// key     HIERARCHY_ID: String(10)  @title: 'HIERARCHY_ID: HIERARCHY_ID' ;
//         ENTITY_CODE: String(10)  @title: 'ENTITY_CODE: ENTITY_CODE' ;
//         LEVEL: Integer  @title: 'LEVEL: LEVEL' ;
//         ROLE_CODE: String(10)  @title: 'ROLE_CODE: ROLE_CODE' ;
//         TYPE: String(10)  @title: 'TYPE: TYPE' ;
//         ACCESS_EDIT: String(1)  @title: 'ACCESS_EDIT: ACCESS_EDIT' ;
//         ACCESS_APPROVE: String(1)  @title: 'ACCESS_APPROVE: ACCESS_APPROVE' ;
//         ACCESS_SENDBACK: String(1)  @title: 'ACCESS_SENDBACK: ACCESS_SENDBACK' ;
//         ACCESS_REJECT: String(1)  @title: 'ACCESS_REJECT: ACCESS_REJECT' ;
//         USER_IDS: String(1000)  @title: 'USER_IDS: USER_IDS' ;
//         TO_ENTITY_CODE : Association to one DEALER_PORTAL.MASTER_ENTITY_CODE
//                             on TO_ENTITY_CODE.BUKRS = ENTITY_CODE;

// }

@cds.persistence.exists
@cds.persistence.calcview
entity VIEW_REQUEST_ACTIVE_STATUS {
    key REQUEST_NO         : Integer64    @title: 'REQUEST_NO: REQUEST_NO';
        SAP_DIST_CODE      : String(10)   @title: 'SAP_DIST_CODE: SAP_DIST_CODE';
        IDEAL_DIST_CODE    : Integer64    @title: 'IDEAL_DIST_CODE: IDEAL_DIST_CODE';
        STATUS             : Integer      @title: 'STATUS: STATUS';
        REGISTERED_ID      : String(100)  @title: 'REGISTERED_ID: REGISTERED_ID';
        ENTITY_CODE        : String(10)   @title: 'ENTITY_CODE: ENTITY_CODE';
        REQUEST_TYPE       : Integer      @title: 'REQUEST_TYPE: REQUEST_TYPE';
        CREATION_TYPE      : Integer      @title: 'CREATION_TYPE: CREATION_TYPE';
        DIST_NAME1         : String(100)  @title: 'DIST_NAME1: DIST_NAME1';
        REQUESTER_ID       : String(100)  @title: 'REQUESTER_ID: REQUESTER_ID';
        CREATED_ON         : Timestamp    @title: 'CREATED_ON: CREATED_ON';
        BP_TYPE_CODE       : String(4)    @title: 'BP_TYPE_CODE: BP_TYPE_CODE';
        BP_TYPE_DESC       : String(100)  @title: 'BP_TYPE_DESC: BP_TYPE_DESC';
        BUYER_ASSIGN_CHECK : String(1)    @title: 'BUYER_ASSIGN_CHECK: BUYER_ASSIGN_CHECK';
        COMMENT            : String(1000) @title: 'COMMENT: COMMENT';
        LEGACY_ID          : String(10)   @title: 'LEGACY_ID: LEGACY_ID';
        DIST_CODE          : String(50)   @title: 'DIST_CODE: DIST_CODE';
        NDA_TYPE           : String(50)   @title: 'NDA_TYPE: NDA_TYPE';
        REMINDER_COUNT     : Integer      @title: 'REMINDER_COUNT: REMINDER_COUNT';
        REQUEST_NO_1       : Integer64    @title: 'REQUEST_NO_1: REQUEST_NO';
        ACTIVE             : String(1)    @title: 'ACTIVE: ACTIVE';
        MOBILE_NO          : String(30)   @title: 'MOBILE_NO: MOBILE_NO';
        TO_STATUS          : Association to one DEALER_PORTAL.MASTER_STATUS
                                 on TO_STATUS.CODE = STATUS;
}

//done card
@cds.persistence.exists 
@cds.persistence.calcview 
Entity VIEW_REQUEST_REJECTED_STATUS {
        CODE: Integer  @title: 'CODE: CODE' ; 
key     DESCRIPTION: String(50)  @title: 'DESCRIPTION: DESCRIPTION' ; 
        REJ_STATUS_COUNT: Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
        STATUS: Integer  @title: 'STATUS: STATUS' ; 
}

//done card
@cds.persistence.exists 
@cds.persistence.calcview 
Entity VIEW_ENTITY_CODE_COUNT {
key     BUKRS: String(4)  @title: 'BUKRS: BUKRS' ; 
key     BUTXT: String(50)  @title: 'BUTXT: BUTXT' ; 
        ENTITY_COUNT : Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
key     ENTITY_CODE: String(10)  @title: 'ENTITY_CODE: ENTITY_CODE' ; 
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity VIEW_REQUEST_DISTRIBUTOR_TYPE {
        REQUEST_NO: Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
key     DIST_CODE: String(50)  @title: 'DIST_CODE: DIST_CODE' ; 
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity VIEW_REQUEST_COUNTER_STATUS {
        REQUEST_NO: Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
        STATUS: Integer  @title: 'STATUS: STATUS' ; 
        CODE: Integer  @title: 'CODE: CODE' ; 
key     DESCRIPTION: String(50)  @title: 'DESCRIPTION: DESCRIPTION' ; 
}

//done card
@cds.persistence.exists 
@cds.persistence.calcview 
Entity VIEW_REQUEST_TYPE_COUNT {
        CODE: Integer  @title: 'CODE: CODE' ; 
key     DESCRIPTION: String(50)  @title: 'DESCRIPTION: DESCRIPTION' ; 
        REQ_TYPE_COUNT: Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
        REQUEST_TYPE: Integer  @title: 'REQUEST_TYPE: REQUEST_TYPE' ; 
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity VIEW_REQUEST_ALL_STATUS_COUNT {
        REQUEST_NO: Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
        STATUS: Integer  @title: 'STATUS: STATUS' ; 
        CODE: Integer  @title: 'CODE: CODE' ; 
key     DESCRIPTION: String(50)  @title: 'DESCRIPTION: DESCRIPTION' ; 
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity VIEW_TURN_AROUND_TIME {
        FINAL_APPR_EVENT_NO: Integer  @title: 'FINAL_APPR_EVENT_NO: FINAL_APPR_EVENT_NO' ; 
        FINAL_APPR_EVENT_CODE: Integer  @title: 'FINAL_APPR_EVENT_CODE: FINAL_APPR_EVENT_CODE' ; 
        REQUEST_NO: Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
        FINAL_APPR_CREATED_ON: Timestamp  @title: 'FINAL_APPR_CREATED_ON: FINAL_APPR_CREATED_ON' ; 
        FORM_SUB_EVENT_NO: Integer  @title: 'FORM_SUB_EVENT_NO: FORM_SUB_EVENT_NO' ; 
        FORM_SUB_EVENT_CODE: Integer  @title: 'FORM_SUB_EVENT_CODE: FORM_SUB_EVENT_CODE' ; 
        FORM_SUB_TIMESTAMP: Timestamp  @title: 'FORM_SUB_TIMESTAMP: FORM_SUB_TIMESTAMP' ; 
        REQ_INV_EVENT_NO: Integer  @title: 'REQ_INV_EVENT_NO: REQ_INV_EVENT_NO' ; 
        REQ_INV_EVENT_CODE: Integer  @title: 'REQ_INV_EVENT_CODE: REQ_INV_EVENT_CODE' ; 
        REQ_INV_CREATED_ON: Timestamp  @title: 'REQ_INV_CREATED_ON: REQ_INV_CREATED_ON' ; 
        REQ_CREATE_EVENT_NO: Integer  @title: 'REQ_CREATE_EVENT_NO: REQ_CREATE_EVENT_NO' ; 
        REQ_CREATE_EVENT_CODE: Integer  @title: 'REQ_CREATE_EVENT_CODE: REQ_CREATE_EVENT_CODE' ; 
        REQ_CREATE_CREATED_ON: Timestamp  @title: 'REQ_CREATE_CREATED_ON: REQ_CREATE_CREATED_ON' ; 
        FS_FA_TAT_DAYS: Integer  @title: 'FS_FA_TAT_DAYS: FS_FA_TAT_DAYS' ; 
        INV_FS_TAT_DAYS: Integer  @title: 'INV_FS_TAT_DAYS: INV_FS_TAT_DAYS' ; 
        FS_FA_TAT_HRS: Integer  @title: 'FS_FA_TAT_HRS: FS_FA_TAT_HRS' ; 
        CREATE_INV_TAT_DAYS: Integer  @title: 'CREATE_INV_TAT_DAYS: CREATE_INV_TAT_DAYS' ; 
        INV_FS_TAT_HRS: Integer  @title: 'INV_FS_TAT_HRS: INV_FS_TAT_HRS' ; 
        CREATE_INV_TAT_HRS: Integer  @title: 'CREATE_INV_TAT_HRS: CREATE_INV_TAT_HRS' ; 
        FS_FA_TAT_MIN: Integer  @title: 'FS_FA_TAT_MIN: FS_FA_TAT_MIN' ; 
        INV_FS_TAT_MIN: Integer  @title: 'INV_FS_TAT_MIN: INV_FS_TAT_MIN' ; 
        CREATE_INV_TAT_MIN: Integer  @title: 'CREATE_INV_TAT_MIN: CREATE_INV_TAT_MIN' ; 
        FS_FA_TAT: Integer  @title: 'FS_FA_TAT: FS_FA_TAT' ; 
        INV_FS_TAT: Integer  @title: 'INV_FS_TAT: INV_FS_TAT' ; 
        CREATE_INV_TAT: Integer  @title: 'CREATE_INV_TAT: CREATE_INV_TAT' ; 
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity REQ_TURNAROUND {
        CREATE_INV_TAT: Integer  @title: 'CREATE_INV_TAT: CREATE_INV_TAT' ; 
        INV_FS_TAT: Integer  @title: 'INV_FS_TAT: INV_FS_TAT' ; 
        FS_FA_TAT: Integer  @title: 'FS_FA_TAT: FS_FA_TAT' ; 
        CREATE_INV_TAT_MIN: Integer  @title: 'CREATE_INV_TAT_MIN: CREATE_INV_TAT_MIN' ; 
        INV_FS_TAT_MIN: Integer  @title: 'INV_FS_TAT_MIN: INV_FS_TAT_MIN' ; 
        FS_FA_TAT_MIN: Integer  @title: 'FS_FA_TAT_MIN: FS_FA_TAT_MIN' ; 
        CREATE_INV_TAT_HRS: Integer  @title: 'CREATE_INV_TAT_HRS: CREATE_INV_TAT_HRS' ; 
        INV_FS_TAT_HRS: Integer  @title: 'INV_FS_TAT_HRS: INV_FS_TAT_HRS' ; 
        CREATE_INV_TAT_DAYS: Integer  @title: 'CREATE_INV_TAT_DAYS: CREATE_INV_TAT_DAYS' ; 
        FS_FA_TAT_HRS: Integer  @title: 'FS_FA_TAT_HRS: FS_FA_TAT_HRS' ; 
        INV_FS_TAT_DAYS: Integer  @title: 'INV_FS_TAT_DAYS: INV_FS_TAT_DAYS' ; 
        FS_FA_TAT_DAYS: Integer  @title: 'FS_FA_TAT_DAYS: FS_FA_TAT_DAYS' ; 
key     UNIT: String(50)  @title: 'UNIT: UNIT' ; 
}

//Request Turn Around Time
@cds.persistence.exists 
@cds.persistence.calcview 
Entity REQUEST_TAT {
        CREATE_INV_TAT: Integer  @title: 'CREATE_INV_TAT: CREATE_INV_TAT' ; 
        INV_FS_TAT: Integer  @title: 'INV_FS_TAT: INV_FS_TAT' ; 
        FS_FA_TAT: Integer  @title: 'FS_FA_TAT: FS_FA_TAT' ; 
key     UNIT: String(50)  @title: 'UNIT: UNIT' ; 
        CREATE_INV_TAT_MIN: Integer  @title: 'CREATE_INV_TAT_MIN: CREATE_INV_TAT_MIN' ; 
        INV_FS_TAT_MIN: Integer  @title: 'INV_FS_TAT_MIN: INV_FS_TAT_MIN' ; 
        FS_FA_TAT_MIN: Integer  @title: 'FS_FA_TAT_MIN: FS_FA_TAT_MIN' ; 
        CREATE_INV_TAT_HRS: Integer  @title: 'CREATE_INV_TAT_HRS: CREATE_INV_TAT_HRS' ; 
        INV_FS_TAT_HRS: Integer  @title: 'INV_FS_TAT_HRS: INV_FS_TAT_HRS' ; 
        FS_FA_TAT_HRS: Integer  @title: 'FS_FA_TAT_HRS: FS_FA_TAT_HRS' ; 
        CREATE_INV_TAT_DAYS: Integer  @title: 'CREATE_INV_TAT_DAYS: CREATE_INV_TAT_DAYS' ; 
        INV_FS_TAT_DAYS: Integer  @title: 'INV_FS_TAT_DAYS: INV_FS_TAT_DAYS' ; 
        FS_FA_TAT_DAYS: Integer  @title: 'FS_FA_TAT_DAYS: FS_FA_TAT_DAYS' ; 
key     STAGE: String(50)  @title: 'STAGE: STAGE' ; 
        CREATE_INV_TAT_1: Integer  @title: 'CREATE_INV_TAT_1: CREATE_INV_TAT_1' ; 
        INV_FS_TAT_1: Integer  @title: 'INV_FS_TAT_1: INV_FS_TAT_1' ; 
        FS_FA_TAT_1: Integer  @title: 'FS_FA_TAT_1: FS_FA_TAT_1' ; 
        CREATE_INV_TAT_MIN_1: Integer  @title: 'CREATE_INV_TAT_MIN_1: CREATE_INV_TAT_MIN_1' ; 
        INV_FS_TAT_MIN_1: Integer  @title: 'INV_FS_TAT_MIN_1: INV_FS_TAT_MIN_1' ; 
        FS_FA_TAT_MIN_1: Integer  @title: 'FS_FA_TAT_MIN_1: FS_FA_TAT_MIN_1' ; 
        CREATE_INV_TAT_HRS_1: Integer  @title: 'CREATE_INV_TAT_HRS_1: CREATE_INV_TAT_HRS_1' ; 
        INV_FS_TAT_HRS_1: Integer  @title: 'INV_FS_TAT_HRS_1: INV_FS_TAT_HRS_1' ; 
        CREATE_INV_TAT_DAYS_1: Integer  @title: 'CREATE_INV_TAT_DAYS_1: CREATE_INV_TAT_DAYS_1' ; 
        FS_FA_TAT_HRS_1: Integer  @title: 'FS_FA_TAT_HRS_1: FS_FA_TAT_HRS_1' ; 
        INV_FS_TAT_DAYS_1: Integer  @title: 'INV_FS_TAT_DAYS_1: INV_FS_TAT_DAYS_1' ; 
        FS_FA_TAT_DAYS_1: Integer  @title: 'FS_FA_TAT_DAYS_1: FS_FA_TAT_DAYS_1' ; 
key     UNIT_1: String(50)  @title: 'UNIT_1: UNIT_1' ; 
key     STAGE_1: String(50)  @title: 'STAGE_1: STAGE_1' ; 
        CREATE_INV_TAT_2: Integer  @title: 'CREATE_INV_TAT_2: CREATE_INV_TAT_2' ; 
        INV_FS_TAT_2: Integer  @title: 'INV_FS_TAT_2: INV_FS_TAT_2' ; 
        FS_FA_TAT_2: Integer  @title: 'FS_FA_TAT_2: FS_FA_TAT_2' ; 
        CREATE_INV_TAT_MIN_2: Integer  @title: 'CREATE_INV_TAT_MIN_2: CREATE_INV_TAT_MIN_2' ; 
        INV_FS_TAT_MIN_2: Integer  @title: 'INV_FS_TAT_MIN_2: INV_FS_TAT_MIN_2' ; 
        FS_FA_TAT_MIN_2: Integer  @title: 'FS_FA_TAT_MIN_2: FS_FA_TAT_MIN_2' ; 
        CREATE_INV_TAT_HRS_2: Integer  @title: 'CREATE_INV_TAT_HRS_2: CREATE_INV_TAT_HRS_2' ; 
        INV_FS_TAT_HRS_2: Integer  @title: 'INV_FS_TAT_HRS_2: INV_FS_TAT_HRS_2' ; 
        CREATE_INV_TAT_DAYS_2: Integer  @title: 'CREATE_INV_TAT_DAYS_2: CREATE_INV_TAT_DAYS_2' ; 
        FS_FA_TAT_HRS_2: Integer  @title: 'FS_FA_TAT_HRS_2: FS_FA_TAT_HRS_2' ; 
        INV_FS_TAT_DAYS_2: Integer  @title: 'INV_FS_TAT_DAYS_2: INV_FS_TAT_DAYS_2' ; 
        FS_FA_TAT_DAYS_2: Integer  @title: 'FS_FA_TAT_DAYS_2: FS_FA_TAT_DAYS_2' ; 
key     UNIT_2: String(50)  @title: 'UNIT_2: UNIT_2' ; 
key     STAGE_2: String(50)  @title: 'STAGE_2: STAGE_2' ; 
key     AVG_TAT_SEC: Decimal(16)  @title: 'AVG_TAT_SEC: AVG_TAT_SEC' ; 
key     PROGRESS: String(50)  @title: 'PROGRESS: PROGRESS' ; 
key     AVG_TAT_MIN: Decimal(16)  @title: 'AVG_TAT_MIN: AVG_TAT_MIN' ; 
key     AVG_TAT_HRS: Decimal(16)  @title: 'AVG_TAT_HRS: AVG_TAT_HRS' ; 
key     AVG_TAT_DAYS: Decimal(16)  @title: 'AVG_TAT_DAYS: AVG_TAT_DAYS' ; 
}

//done card
@cds.persistence.exists 
@cds.persistence.calcview 
Entity VIEW_REQUEST_ACTION_STATUS {
        CODE: Integer  @title: 'CODE: CODE' ; 
key     DESCRIPTION: String(50)  @title: 'DESCRIPTION: DESCRIPTION' ; 
        ACT_STATUS_COUNT: Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
        STATUS: Integer  @title: 'STATUS: STATUS' ; 
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity APPROVAL_PENDING {
        REQUEST_NO: Integer64  @title: 'REQUEST_NO: REQUEST_NO' ; 
        STATUS: Integer  @title: 'STATUS: STATUS' ; 
key     APPR_PENDING: String(50)  @title: 'APPR_PENDING: APPR_PENDING' ; 
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity PURCHASE_ORDER_TOTAL {
        PR_NO: Integer64  @title: 'PR_NO: PR_NO' ; 
key     DISTRIBUTOR_ID: String(10)  @title: 'DISTRIBUTOR_ID: DISTRIBUTOR_ID' ; 
key     SHIP_FROM: String(200)  @title: 'SHIP_FROM: SHIP_FROM' ; 
key     MATERIAL_CODE: String(40)  @title: 'MATERIAL_CODE: MATERIAL_CODE' ; 
key     MATERIAL_DESC: String(50)  @title: 'MATERIAL_DESC: MATERIAL_DESC' ; 
key     IMAGE_URL: String(1000)  @title: 'IMAGE_URL: IMAGE_URL' ; 
key     HSN_CODE: String(10)  @title: 'HSN_CODE: HSN_CODE' ; 
        QUANTITY: Integer  @title: 'QUANTITY: QUANTITY' ; 
key     TAXES_AMOUNT: String(10)  @title: 'TAXES_AMOUNT: TAXES_AMOUNT' ; 
key     PR_STATUS: String(10)  @title: 'PR_STATUS: PR_STATUS' ; 
        T_AMOUNT: Decimal(16)  @title: 'T_AMOUNT: T_AMOUNT' ; 
key     NET_AMOUNT: String(10)  @title: 'NET_AMOUNT: NET_AMOUNT' ; 
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity RGA_ORDER_TOTAL {
        RGA_NO: Integer64  @title: 'RGA_NO: RGA_NO' ; 
key     DISTRIBUTOR_ID: String(100)  @title: 'DISTRIBUTOR_ID: DISTRIBUTOR_ID' ; 
key     ITEM_CODE: String(15)  @title: 'ITEM_CODE: ITEM_CODE' ; 
key     ITEM_DESCRIPTION: String(1000)  @title: 'ITEM_DESCRIPTION: ITEM_DESCRIPTION' ; 
        RETURN_QUANTITY: Integer  @title: 'RETURN_QUANTITY: RETURN_QUANTITY' ; 
}
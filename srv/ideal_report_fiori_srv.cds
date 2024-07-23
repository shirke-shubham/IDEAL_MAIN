using {
  DEALER_PORTAL,
  VIEW_REQUEST_ACTIVE_STATUS
} from '../db/MASTER_TABLES';
using {
  DEALER_PORTAL.REQUEST_INFO,
  DEALER_PORTAL.MASTER_ENTITY_AND_TYPE,
  DEALER_PORTAL.REGFORM_ADDRESS,
  DEALER_PORTAL.REGFORM_CONTACTS,
  DEALER_PORTAL.REGFORM_BANKS,
  DEALER_PORTAL.REGFORM_ATTACHMENTS_CMS,
  DEALER_PORTAL.REGFORM_BUSINESS_HISTORY,
  DEALER_PORTAL.REGFORM_CUSTOMERS,
  DEALER_PORTAL.REGFORM_PROMOTERS,
  DEALER_PORTAL.REGFORM_ATTACH_FIELDS,
  DEALER_PORTAL.REGFORM_ATTACHMENTS,
  DEALER_PORTAL.REGFORM_BANKING_DETAILS

} from '../db/TRANSACTION_TABLES';


service ideal_report_fiori_srv {
    entity MasterClientInfo                as projection on DEALER_PORTAL.MASTER_EMAIL_CONTACT_ID;
  entity MasterIdealUsers                 as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
  entity RequestInfo                     as projection on DEALER_PORTAL.REQUEST_INFO{
    *,
    REQUEST_NO as REQUEST_NUM: String,  
  };
  entity MasterIbanCountry               as projection on DEALER_PORTAL.MASTER_IBAN_COUNTRY;
  entity RegSupplierLog                  as projection on DEALER_PORTAL.SUPPLIER_PROFILE_LOG;
  entity MasterApprovalHierarchy         as projection on DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY;
  entity ViewRequestActiveStatus         as projection on VIEW_REQUEST_ACTIVE_STATUS;
  entity RegFormCMS                      as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS_CMS;
  entity MasterEntityAndType as projection on DEALER_PORTAL.MASTER_ENTITY_AND_TYPE;
  entity MasterCountry                   as projection on DEALER_PORTAL.MASTER_COUNTRY;
  entity MasterApprovalTypes as projection on DEALER_PORTAL.MASTER_APPROVAL_TYPES;
  entity MasterStatus                    as projection on DEALER_PORTAL.MASTER_STATUS
  {
    *,
    case when CODE = 1 then 1 
        when CODE = 2 then 3 
        when CODE = 3 then 1
        when CODE = 4 then 3 
        when CODE = 5 then 5 
        when CODE = 6 then 5 
        when CODE = 7 then 0 
        when CODE = 8 then 1 
        when CODE = 9 then 5 
        when CODE = 10 then 5 
        when CODE = 11 then 3   
        when CODE = 14 then 1
        else 2                      
         end as CRITICALITY:Integer,     
  };
  entity RegFormAddress                  as projection on DEALER_PORTAL.REGFORM_ADDRESS{
    *,
    TO_MAIN : Association to one DEALER_PORTAL.REQUEST_INFO
                                       on TO_MAIN.REQUEST_NO = REQUEST_NO  
  };
  entity RegFormContacts                 as projection on DEALER_PORTAL.REGFORM_CONTACTS{
    *,
    TO_MAIN : Association to one DEALER_PORTAL.REQUEST_INFO
                                       on TO_MAIN.REQUEST_NO = REQUEST_NO 
  };
  entity RegFormBanks                    as projection on DEALER_PORTAL.REGFORM_BANKS{
    *,
    TO_MAIN : Association to one DEALER_PORTAL.REQUEST_INFO
                                       on TO_MAIN.REQUEST_NO = REQUEST_NO 
  };
  entity RegFormCustomers                as projection on DEALER_PORTAL.REGFORM_CUSTOMERS{
    *,
    TO_MAIN : Association to one DEALER_PORTAL.REQUEST_INFO
                                       on TO_MAIN.REQUEST_NO = REQUEST_NO 
  };
  entity MasterRegformFieldsConfig       as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG{
    *,
       case when  S1G1T1F1 = 'X' AND TYPE = 'V' then false else true end as BS1G1T1F1 : Boolean,
       case when  S1G1T1F2 = 'X' AND TYPE = 'V' then false else true end as BS1G1T1F2 : Boolean,
       case when  S1G1T1F3 = 'X' AND TYPE = 'V' then false else true end as BS1G1T1F3 : Boolean,
       case when  S1G1T1F4 = 'X' AND TYPE = 'V' then false else true end as BS1G1T1F4 : Boolean,
       case when  S1G1T1F5 = 'X' AND TYPE = 'V' then false else true end as BS1G1T1F5 : Boolean,
       case when  S1G1T1F6 = 'X' AND TYPE = 'V' then false else true end as BS1G1T1F6 : Boolean,
       case when  S1G1T1F7 = 'X' AND TYPE = 'V' then false else true end as BS1G1T1F7 : Boolean,
       case when  S1G1T1F8 = 'X' AND TYPE = 'V' then false else true end as BS1G1T1F8 : Boolean,
        // Section 1 - General Section
        // Group 2 - Distributor Address
        case when S1G2T1F1 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F1 : Boolean,
        case when S1G2T1F2 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F2 : Boolean,
        case when S1G2T1F3 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F3 : Boolean,
        case when S1G2T1F4 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F4 : Boolean,
        case when S1G2T1F5 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F5 : Boolean,
        case when S1G2T1F6 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F6 : Boolean,
        case when S1G2T1F7 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F7 : Boolean,
        case when S1G2T1F8 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F8 : Boolean,
        case when S1G2T1F9 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F9 : Boolean,
        case when S1G2T1F10 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F10 : Boolean,
        case when S1G2T1F11 = 'X' AND TYPE = 'V' then false else true end as BS1G2T1F11 : Boolean,
        // Section 1 - General Section
        // Group 3 - Other Office Address
        case when S1G3T1F1 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F1 : Boolean,
        case when S1G3T1F2 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F2 : Boolean,
        case when S1G3T1F3 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F3 : Boolean,
        case when S1G3T1F4 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F4 : Boolean,
        case when S1G3T1F5 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F5 : Boolean,
        case when S1G3T1F6 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F6 : Boolean,
        case when S1G3T1F7 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F7 : Boolean,
        case when S1G3T1F8 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F8 : Boolean,
        case when S1G3T1F9 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F9 : Boolean,
        case when S1G3T1F10 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F10 : Boolean,
        case when S1G3T1F11 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F11 : Boolean,
        case when S1G3T1F12 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F12 : Boolean,
        case when S1G3T1F13 = 'X' AND TYPE = 'V' then false else true end as BS1G3T1F13 : Boolean,
        // Section 1 - General Section
        // Group 4 - Contact information
        case when S1G4T1F1 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F1 : Boolean,
        case when S1G4T1F2 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F2 : Boolean,
        case when S1G4T1F3 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F3 : Boolean,
        case when S1G4T1F4 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F4 : Boolean,
        case when S1G4T1F5 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F5 : Boolean,
        case when S1G4T1F6 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F6 : Boolean,
        case when S1G4T1F7 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F7 : Boolean,
        case when S1G4T1F8 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F8 : Boolean,
        case when S1G4T1F9 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F9 : Boolean,
        case when S1G4T1F10 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F10 : Boolean,
        case when S1G4T1F11 = 'X' AND TYPE = 'V' then false else true end as BS1G4T1F11 : Boolean,
        // Section 1 - General Section
        // Group 5 - Other Contact information
        case when S1G5T2F1 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F1 : Boolean, 
        case when S1G5T2F2 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F2 : Boolean,
        case when S1G5T2F3 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F3 : Boolean,
        case when S1G5T2F4 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F4 : Boolean,
        case when S1G5T2F5 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F5 : Boolean,
        case when S1G5T2F6 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F6 : Boolean,
        case when S1G5T2F7 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F7 : Boolean,
        case when S1G5T2F8 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F8 : Boolean,
        case when S1G5T2F9 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F9 : Boolean,
        // S1G5T2F10
        case when S1G5T2F11 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F11 : Boolean,
        case when S1G5T2F12 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F12 : Boolean,
        case when S1G5T2F13 = 'X' AND TYPE = 'V' then false else true end as BS1G5T2F13 : Boolean,
        // Section 1 - General Section
        // Group 6 - Additional Information
        case when S1G6T1F1 = 'X' AND TYPE = 'V' then false else true end as BS1G6T1F1 : Boolean,
        case when S1G6T1F2 = 'X' AND TYPE = 'V' then false else true end as BS1G6T1F2 : Boolean,
        case when S1G6T1F3 = 'X' AND TYPE = 'V' then false else true end as BS1G6T1F3 : Boolean,
        case when S1G6T1F4 = 'X' AND TYPE = 'V' then false else true end as BS1G6T1F4 : Boolean,
        case when S1G6T1F5 = 'X' AND TYPE = 'V' then false else true end as BS1G6T1F5 : Boolean,
        case when S1G6T1F6 = 'X' AND TYPE = 'V' then false else true end as BS1G6T1F6 : Boolean,
        // Section 1 - General Section
        // Group 7 - Employee Details
        case when S1G7T1F1 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F1 : Boolean,
        case when S1G7T1F2 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F2 : Boolean,
        case when S1G7T1F3 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F3 : Boolean,
        case when S1G7T1F4 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F4 : Boolean,
        case when S1G7T1F5 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F5 : Boolean,
        case when S1G7T1F6 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F6 : Boolean,
        case when S1G7T1F7 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F7 : Boolean,
        case when S1G7T1F8 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F8 : Boolean,
        case when S1G7T1F9 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F9 : Boolean,
        case when S1G7T1F10 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F10 : Boolean,
        case when S1G7T1F11 = 'X' AND TYPE = 'V' then false else true end as BS1G7T1F11 : Boolean,
        // Section 2 - Financial Section
        // Group 1 - Financial Information
        case when S2G1T1F1 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F1 : Boolean,
        case when S2G1T1F2 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F2 : Boolean,
        case when S2G1T1F3 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F3 : Boolean,
        case when S2G1T1F4 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F4 : Boolean,
        case when S2G1T1F5 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F5 : Boolean,
        case when S2G1T1F6 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F6 : Boolean,
        case when S2G1T1F7 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F7 : Boolean,
        case when S2G1T1F8 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F8 : Boolean,
        case when S2G1T1F9 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F9 : Boolean,
        case when S2G1T1F10 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F10 : Boolean,
        // S2G1T1F11
        // S2G1T1F12
        // S2G1T1F13
        case when S2G1T1F11 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F11 : Boolean,
        case when S2G1T1F12 = 'X' AND TYPE = 'V' then false else true end as BS2G1T1F12 : Boolean,
        // Section 2 - Financial Section
        // Group 2 - Other Bank Details
        case when S2G2T1F1 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F1 : Boolean,
        case when S2G2T1F2 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F2 : Boolean,
        case when S2G2T1F3 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F3 : Boolean,
        case when S2G2T1F4 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F4 : Boolean,
        case when S2G2T1F5 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F5 : Boolean,
        case when S2G2T1F6 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F6 : Boolean,
        case when S2G2T1F7 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F7 : Boolean,
        case when S2G2T1F8 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F8 : Boolean,
        case when S2G2T1F9 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F9 : Boolean,
        case when S2G2T1F10 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F10 : Boolean,
        case when S2G2T1F12 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F12 : Boolean,
        case when S2G2T1F13 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F13 : Boolean,
        // S2G2T1F11
        // S2G2T1F12
        // S2G2T1F13
        case when S2G2T1F14 = 'X' AND TYPE = 'V' then false else true end as BS2G2T1F14 : Boolean,
        // Section 2 - Financial Section
        // Group 2 - Other Bank Details
        //Type 2 - VAT Details
        case when S2G2T2F1 = 'X' AND TYPE = 'V' then false else true end as BS2G2T2F1 : Boolean,
        case when S2G2T2F2 = 'X' AND TYPE = 'V' then false else true end as BS2G2T2F2 : Boolean,
        case when S2G2T2F3 = 'X' AND TYPE = 'V' then false else true end as BS2G2T2F3 : Boolean,
        case when S2G2T2F4 = 'X' AND TYPE = 'V' then false else true end as BS2G2T2F4 : Boolean,
        // Section 2 - Financial Section
        // Group 2 - Other Bank Details
        //Type 3 - ICV Details
        case when S2G2T3F1 = 'X' AND TYPE = 'V' then false else true end as BS2G2T3F1 : Boolean,
        case when S2G2T3F2 = 'X' AND TYPE = 'V' then false else true end as BS2G2T3F2 : Boolean,
        //Section 3 - Financial Section
        // Group 3 - Banking Details
        //Type 1 - Banking Details
        case when S2G3T1F1 = 'X' AND TYPE = 'V' then false else true end as BS2G3T1F1 : Boolean,
        case when S2G3T1F2 = 'X' AND TYPE = 'V' then false else true end as BS2G3T1F2 : Boolean,
        case when S2G3T1F3 = 'X' AND TYPE = 'V' then false else true end as BS2G3T1F3 : Boolean,
        case when S2G3T1F4 = 'X' AND TYPE = 'V' then false else true end as BS2G3T1F4 : Boolean,
        case when S2G3T1F5 = 'X' AND TYPE = 'V' then false else true end as BS2G3T1F5 : Boolean,
        case when S2G3T1F6 = 'X' AND TYPE = 'V' then false else true end as BS2G3T1F6 : Boolean,
        case when S2G3T1F7 = 'X' AND TYPE = 'V' then false else true end as BS2G3T1F7 : Boolean,
         // Section 3 - Operational Section
        // Group 1 - Business History Details
        case when S3G1T1F1 = 'X' AND TYPE = 'V' then false else true end as BS3G1T1F1 : Boolean,
        case when S3G1T1F2 = 'X' AND TYPE = 'V' then false else true end as BS3G1T1F2 : Boolean,
        case when S3G1T1F3 = 'X' AND TYPE = 'V' then false else true end as BS3G1T1F3 : Boolean,
        case when S3G1T1F4 = 'X' AND TYPE = 'V' then false else true end as BS3G1T1F4 : Boolean,
        case when S3G1T1F5 = 'X' AND TYPE = 'V' then false else true end as BS3G1T1F5 : Boolean,
        case when S3G1T1F6 = 'X' AND TYPE = 'V' then false else true end as BS3G1T1F6 : Boolean,
        case when S3G1T1F7 = 'X' AND TYPE = 'V' then false else true end as BS3G1T1F7 : Boolean,
        case when S3G1T1F8 = 'X' AND TYPE = 'V' then false else true end as BS3G1T1F8 : Boolean,
        // Section 3 - Operational Section
        // Group 2 - Customer Details
        case when S3G2T1F1 = 'X' AND TYPE = 'V' then false else true end as BS3G2T1F1 : Boolean,
        case when S3G2T1F2 = 'X' AND TYPE = 'V' then false else true end as BS3G2T1F2 : Boolean,
        case when S3G2T1F3 = 'X' AND TYPE = 'V' then false else true end as BS3G2T1F3 : Boolean,
        case when S3G2T1F4 = 'X' AND TYPE = 'V' then false else true end as BS3G2T1F4 : Boolean,
        case when S3G2T1F5 = 'X' AND TYPE = 'V' then false else true end as BS3G2T1F5 : Boolean,
        case when S3G2T1F6 = 'X' AND TYPE = 'V' then false else true end as BS3G2T1F6 : Boolean,
        // Section 3 - Operational Section
        // Group 3 - Promoter/Management Details
        case when S3G3T1F1 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F1 : Boolean,
        case when S3G3T1F2 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F2 : Boolean,
        case when S3G3T1F3 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F3 : Boolean,
        case when S3G3T1F4 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F4 : Boolean,
        case when S3G3T1F5 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F5 : Boolean,
        case when S3G3T1F6 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F6 : Boolean,
        case when S3G3T1F7 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F7 : Boolean,
        case when S3G3T1F8 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F8 : Boolean,
        case when S3G3T1F9 = 'X' AND TYPE = 'V' then false else true end as BS3G3T1F9 : Boolean,
         // Section 4 - Attachment Section
        // Attachment 1 - Company Profile
        case when S4A1F1 = 'X' AND TYPE = 'V' then false else true end as BS4A1F1 : Boolean, 
        // Attachment 2 - Distributor Document
        case when S4A2F1 = 'X' AND TYPE = 'V' then false else true end as BS4A2F1 : Boolean,
        // Attachment 3 - Bank Account letter issued by the Bank (In Bank's letterhead)
        case when S4A3F1 = 'X' AND TYPE = 'V' then false else true end as BS4A3F1 : Boolean,
        // Attachment 4 - TRN Certificate (Tax Registration Number)
        case when S4A4F1 = 'X' AND TYPE = 'V' then false else true end as BS4A4F1 : Boolean,
        // Attachment 5 - ISO Certificate
        case when S4A5F1 = 'X' AND TYPE = 'V' then false else true end as BS4A5F1 : Boolean,
        //PAN Certificate
        case when S4A6F1 = 'X' AND TYPE = 'V' then false else true end as BS4A6F1 : Boolean,
        //Upload Disclosure Form
        case when S4A7F1 = 'X' AND TYPE = 'V' then false else true end as BS4A7F1 : Boolean,
        //GST Certificate
        case when S4A8F1 = 'X' AND TYPE = 'V' then false else true end as BS4A8F1 : Boolean,
        //License Certificate
        case when S4A9F1 = 'X' AND TYPE = 'V' then false else true end as BS4A9F1 : Boolean,
        //Other certificates
        case when S4A10F1 = 'X' AND TYPE = 'V' then false else true end as BS4A10F1 : Boolean, 
        //Attachment Details
        case when S4A11F1 = 'X' AND TYPE = 'V' then false else true end as BS4A11F1 : Boolean, 
        //Section 5 - Submission page
        case when S5G1F1 = 'X' AND TYPE = 'V' then false else true end as BS5G1F1 : Boolean, 
        case when S5G1F2 = 'X' AND TYPE = 'V' then false else true end as BS5G1F2 : Boolean, 
        case when S5G1F3 = 'X' AND TYPE = 'V' then false else true end as BS5G1F3 : Boolean, 
        case when S5G1F4 = 'X' AND TYPE = 'V' then false else true end as BS5G1F4 : Boolean, 
  };
  entity MasterFormFieldsUpdated         as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_UPDATED;
  entity RegFormAttachFields             as projection on DEALER_PORTAL.REGFORM_ATTACH_FIELDS;
  entity RegFormAttachments              as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS;
  entity MasterRequestType               as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;
  entity MasterUserEntityUsers           as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;
  entity MasterCurrency                  as projection on DEALER_PORTAL.MASTER_CURRENCY;
  entity MasterEntityCode                as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
  entity MasterTelecode                  as projection on DEALER_PORTAL.MASTER_TELECODE;
  entity MasterPostalcode                as projection on DEALER_PORTAL.MASTER_REGEX_POSTALCODE;
  entity MasterRegion                    as projection on DEALER_PORTAL.MASTER_REGION;
  entity MasterUserRole                  as projection on DEALER_PORTAL.MASTER_USER_ROLE;
  entity RegformBusinessHistory          as projection on  DEALER_PORTAL.REGFORM_BUSINESS_HISTORY{
    *,
    TO_MAIN : Association to one DEALER_PORTAL.REQUEST_INFO
                                       on TO_MAIN.REQUEST_NO = REQUEST_NO 
  };
  entity RegformPromoters                as projection on DEALER_PORTAL.REGFORM_PROMOTERS{
    *,
    TO_MAIN : Association to one DEALER_PORTAL.REQUEST_INFO
                                       on TO_MAIN.REQUEST_NO = REQUEST_NO 
  };
  entity RequestActiveStatus             as projection on DEALER_PORTAL.REQUEST_ACTIVE_STATUS;
  entity RegEventsLog                    as projection on DEALER_PORTAL.REQUEST_EVENTS_LOG;
  entity MasteriDealAttachments           as projection on DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS;
  entity EmailActionlog                   as projection on DEALER_PORTAL.IDEAL_EMAIL_LOG;
  entity EmailConfig                  as projection on DEALER_PORTAL.EMAIL_CONFIG;
  entity MasterAddressType         as projection on DEALER_PORTAL.MASTER_ADDRESS_TYPE;
  entity RegformBankingDetails as projection on DEALER_PORTAL.REGFORM_BANKING_DETAILS{
    *,
    TO_MAIN : Association to one DEALER_PORTAL.REQUEST_INFO
                                       on TO_MAIN.REQUEST_NO = REQUEST_NO 
  };

}
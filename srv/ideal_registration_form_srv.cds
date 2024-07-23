using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_ENTITY_AND_TYPE,DEALER_PORTAL.MASTER_COUNTRY,DEALER_PORTAL.MASTER_REGION,DEALER_PORTAL.MASTER_REGFORM_FIELDS_UPDATED,
DEALER_PORTAL.MASTER_CURRENCY,DEALER_PORTAL.MASTER_ENTITY_CODE,DEALER_PORTAL.MASTER_STATUS,DEALER_PORTAL.MASTER_USER_ROLE,
DEALER_PORTAL.MASTER_REQUEST_TYPE,DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG,VIEW_REQUEST_ACTIVE_STATUS,DEALER_PORTAL.MASTER_ADDRESS_TYPE,DEALER_PORTAL.MASTER_SALES,DEALER_PORTAL.MASTER_FINANCE,DEALER_PORTAL.MASTER_LOGISTICS,DEALER_PORTAL.MASTER_SERVICE,
DEALER_PORTAL.MASTER_ATTACHMENT_TYPES,DEALER_PORTAL.MASTER_APPROVAL_TYPES,DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY,DEALER_PORTAL.REGFORM_ATTACHMENTS_CMS,DEALER_PORTAL.MASTER_REGEX_POSTALCODE,DEALER_PORTAL.MASTER_IBAN_COUNTRY,DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS,DEALER_PORTAL.MASTER_IDEAL_SETTINGS,DEALER_PORTAL.MASTER_REQUEST_EVENTS,DEALER_PORTAL.MASTER_EMAIL_CONTACT_ID,DEALER_PORTAL.MASTER_USER_ENTITY_CODES
} from '../db/MASTER_TABLES';

service ideal_registration_form_srv {

    entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity MasterApprovalHierarchy as projection on DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY;
    entity RegformAddress as projection on DEALER_PORTAL.REGFORM_ADDRESS;
    entity RegformBanks as projection on DEALER_PORTAL.REGFORM_BANKS;
    entity RegformBankingDetails as projection on DEALER_PORTAL.REGFORM_BANKING_DETAILS;
    entity RegformContacts as projection on DEALER_PORTAL.REGFORM_CONTACTS;
    entity RegformCustomers as projection on DEALER_PORTAL.REGFORM_CUSTOMERS;
    entity RegformBusinessHistory as projection on DEALER_PORTAL.REGFORM_BUSINESS_HISTORY;
    entity RegformPromoters as projection on DEALER_PORTAL.REGFORM_PROMOTERS;
    entity RegformAttachments as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS;
    entity RegFormCMS as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS_CMS;
    entity RegFormAttachFields as projection on DEALER_PORTAL.REGFORM_ATTACH_FIELDS;
    entity RegSupplierLog as projection on DEALER_PORTAL.SUPPLIER_PROFILE_LOG;
    entity RegEventsLog as projection on DEALER_PORTAL.REQUEST_EVENTS_LOG;
    entity MasterCountry as projection on DEALER_PORTAL.MASTER_COUNTRY;
    entity MasterRegion as projection on DEALER_PORTAL.MASTER_REGION;
    entity MasterCurrency as projection on DEALER_PORTAL.MASTER_CURRENCY;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterStatus as projection on DEALER_PORTAL.MASTER_STATUS;
    entity MasterRequestType as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;
    entity MasterRegformFieldsConfig as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG;
    entity MasterApprovalTypes as projection on DEALER_PORTAL.MASTER_APPROVAL_TYPES;
    
    entity MasterAttachmentTypes     as projection on DEALER_PORTAL.MASTER_ATTACHMENT_TYPES;
    entity MasterTelecode            as projection on DEALER_PORTAL.MASTER_TELECODE;
    entity MasterPostalcode          as projection on DEALER_PORTAL.MASTER_REGEX_POSTALCODE;
    entity MasterIbanCountry         as projection on DEALER_PORTAL.MASTER_IBAN_COUNTRY;
    entity MasteriDealAttachments     as projection on DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS;
    entity MasterIdealSettings        as projection on DEALER_PORTAL.MASTER_IDEAL_SETTINGS;          
    entity MasterRequestEvents       as projection on DEALER_PORTAL.MASTER_REQUEST_EVENTS;
    entity MasterClientInfo          as projection on DEALER_PORTAL.MASTER_EMAIL_CONTACT_ID;
    entity MasterIdealUsers           as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
    entity MasterIdealUserEntity      as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;
    entity MasterUserRole             as projection on DEALER_PORTAL.MASTER_USER_ROLE;
    entity MasterRegformFieldsUpdated as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_UPDATED;
    entity MasterAddressType         as projection on DEALER_PORTAL.MASTER_ADDRESS_TYPE;
    entity RequestActiveStatus as projection on DEALER_PORTAL.REQUEST_ACTIVE_STATUS;
    entity ViewRequestActiveStatus as projection on VIEW_REQUEST_ACTIVE_STATUS;
    // entity CalcHierarchyMatrix as projection on CALC_HIERARCHY_MATRIX;

    entity MasterService as projection on DEALER_PORTAL.MASTER_SERVICE;
    entity MasterSales as projection on DEALER_PORTAL.MASTER_SALES;
    entity MasterFinance as projection on DEALER_PORTAL.MASTER_FINANCE;
    entity MasterLogistics as projection on DEALER_PORTAL.MASTER_LOGISTICS;
    entity MasterEntityAndType as projection on DEALER_PORTAL.MASTER_ENTITY_AND_TYPE;

    type User_Details : {
        USER_ROLE : String(50);
        USER_ID   : String(50);
    }

    type securityPinResponse {
    CREATED_ON    : Timestamp;
    IS_MATCH:Boolean;
    RESPONSE_MESSAGE:String(30);
    
  }
  type MessengerData {
      loginId : String;
      mailTo  : String;
    }

    type AttachmentID {
    REQUEST_NO : Integer64;
    SR_NO      : Integer;
    DOC_ID     : Integer64;
  }

    function GetDraftData(requestNo : Integer, entityCode : String, creationType : Integer, userId : String, userRole : String)  returns many String;
    function GetSecurityPin(distributorName : String, distributorEmail : String, requesterId : String, userId : String, userRole : String)returns many String;
    function CheckSecurityPin(distributorEmail : String,securityPin:String, userId : String, userRole : String) returns securityPinResponse;
    action MessengerService(action : String, appType : String, messengerData : MessengerData, inputData : many RequestInfo, eventsData : many RegEventsLog, userDetails : User_Details)returns many String;
    action PostRegFormData(action : String, appType : String,stepNo : Integer, reqHeader : many RequestInfo, addressData : many RegformAddress, promotersData : many RegformPromoters,businessHistoryData : many RegformBusinessHistory,contactsData : many RegformContacts, bankData : many RegformBanks,bankingDetails : many RegformBankingDetails,
    customerData : many RegformCustomers,attachmentData : many RegformAttachments,attachmentFieldsData : many RegFormAttachFields, updatedFields : many String, eventsData : many RegEventsLog, userDetails : User_Details) returns many String;
    action   ManageCMS(action : String, attachmentId : AttachmentID, inputData : many RegFormCMS, userDetails : User_Details) returns many String;
    action   EditRegFormData(action : String, // APPROVER | VENDOR 
    stepNo : Integer,reqHeader : many RequestInfo,addressData : many RegformAddress,contactsData : many RegformContacts,updatedFields : many String,editLog : many RegSupplierLog,userDetails : User_Details) returns many String;
    //Action for Approval
    action RegFormDataApproval(action : String,inputData : many RequestInfo,addressData : many RegformAddress,
    contactsData : many RegformContacts,bankData : many RegformBanks,eventsData : many RegEventsLog,
    userDetails : User_Details)returns many String;
    //Action for DistEditRequest
    action RegFormDistEdit(action:String,reqHeader: many RequestInfo,eventsData:many RegEventsLog,userDetails : User_Details) returns many String;  
}
using {DEALER_PORTAL} from '../db/MASTER_TABLES';
using {DEALER_PORTAL.IDEAL_ERROR_LOG,
DEALER_PORTAL.REGFORM_FOLDER_IDS,DEALER_PORTAL.REQUEST_INFO,
DEALER_PORTAL.REGFORM_ADDRESS,
DEALER_PORTAL.REGFORM_BANKS,
DEALER_PORTAL.REGFORM_BANKING_DETAILS,
DEALER_PORTAL.REGFORM_CONTACTS,
DEALER_PORTAL.REGFORM_CUSTOMERS,
DEALER_PORTAL.REGFORM_BUSINESS_HISTORY,
DEALER_PORTAL.REGFORM_PROMOTERS,
DEALER_PORTAL.REGFORM_ATTACHMENTS,DEALER_PORTAL.REQUEST_ACTIVE_STATUS,DEALER_PORTAL.REGFORM_ATTACH_FIELDS
} from '../db/TRANSACTION_TABLES';

service ideal_admin_panel_srv {

    entity MasterCountry as projection on DEALER_PORTAL.MASTER_COUNTRY;
    entity MasterTableNames as projection on DEALER_PORTAL.MASTER_TABLENAMES;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterAttachmentTypes as projection on DEALER_PORTAL.MASTER_ATTACHMENT_TYPES;
    entity MasterIdealSettings as projection on DEALER_PORTAL.MASTER_IDEAL_SETTINGS;
    entity MasterIdealAttachments as projection on DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS;
    entity MasterStatus as projection on DEALER_PORTAL.MASTER_STATUS;
    entity MasterRequestType as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;
    entity MasterIdealUsers as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
    entity MasterUserEntityUsers as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;
    entity MasterUserRole as projection on DEALER_PORTAL.MASTER_USER_ROLE;
    entity IdealErrorLog as projection on DEALER_PORTAL.IDEAL_ERROR_LOG;
    entity RegformFolderIds as projection on DEALER_PORTAL.REGFORM_FOLDER_IDS;
    entity EmailConfig as projection on DEALER_PORTAL.EMAIL_CONFIG;
    entity MasterRegformFieldsConfig as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG;
    entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity RegformAddress as projection on DEALER_PORTAL.REGFORM_ADDRESS;
    entity RegformBanks as projection on DEALER_PORTAL.REGFORM_BANKS;
    entity RegformBankingDetails as projection on DEALER_PORTAL.REGFORM_BANKING_DETAILS;
    entity RegformContacts as projection on DEALER_PORTAL.REGFORM_CONTACTS;
    entity RegformCustomers as projection on DEALER_PORTAL.REGFORM_CUSTOMERS;
    entity RegformBusinessHistory as projection on DEALER_PORTAL.REGFORM_BUSINESS_HISTORY;
    entity MasterApprovalHierarchy as projection on DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY;
    entity RegformPromoters as projection on DEALER_PORTAL.REGFORM_PROMOTERS;
    entity RegformAttachments as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS;
    entity MasterAddressType as projection on DEALER_PORTAL.MASTER_ADDRESS_TYPE;
    entity MasterRegformFieldsUpdated as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_UPDATED;
    entity RegFormAttachFields as projection on DEALER_PORTAL.REGFORM_ATTACH_FIELDS;
    entity MasterRegion as projection on DEALER_PORTAL.MASTER_REGION;
    entity MasterCurrency as projection on DEALER_PORTAL.MASTER_CURRENCY;
    entity RequestActiveStatus as projection on DEALER_PORTAL.REQUEST_ACTIVE_STATUS;
    entity MasterEntityAndType as projection on DEALER_PORTAL.MASTER_ENTITY_AND_TYPE;
    entity MasterApprovalTypes as projection on DEALER_PORTAL.MASTER_APPROVAL_TYPES;
    
    type User_Details:{
    USER_ROLE: String(50);
    USER_ID: String(50);
  };

  function GetAdminPanelData(action : String, tableCode : String, requestNo : Integer) returns array of String;
  //Get Visible and Mandatory Fields
  function GetVisbleMandatoryFields(requestType : Integer, entityCode : String)returns array of String;
  //Post Data for Admin Panel
  action   PostAdminPanelData(input : String)returns array of String;
  //Post Admin Panel Edits
  action EditAdminPanelData(input : String)returns array of String;
  function TestOnPremiseConnection(sapClient : String, destFileName : String)returns array of String;
  action PostVisibleMandatoryFields(requestType : Integer, entityCode : String, copyEntityCode:String, userDetails:User_Details) returns array of String;
  //new added
  function GetAllVisibleMandatoryEntity(reqTypeCode:Integer, userId : String, userRole : String) returns many String;

}
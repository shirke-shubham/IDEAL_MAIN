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


service ideal_additional_process_srv {
  entity MasterClientInfo                as projection on DEALER_PORTAL.MASTER_EMAIL_CONTACT_ID;
  entity MasterApprovalHierarchy         as projection on DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY;
  entity MasterIdealUsers                as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
  entity RequestInfo                     as projection on DEALER_PORTAL.REQUEST_INFO;
  entity MasterIbanCountry               as projection on DEALER_PORTAL.MASTER_IBAN_COUNTRY;
  entity RegSupplierLog                  as projection on DEALER_PORTAL.SUPPLIER_PROFILE_LOG;
  entity ViewRequestActiveStatus         as projection on VIEW_REQUEST_ACTIVE_STATUS;
  entity RegFormCMS                      as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS_CMS;
  entity MasterCountry                   as projection on DEALER_PORTAL.MASTER_COUNTRY;
  entity MasterStatus                    as projection on DEALER_PORTAL.MASTER_STATUS;
  entity RegFormAddress                  as projection on DEALER_PORTAL.REGFORM_ADDRESS;
  entity RegFormContacts                 as projection on DEALER_PORTAL.REGFORM_CONTACTS;
  entity RegFormBanks                    as projection on DEALER_PORTAL.REGFORM_BANKS;
  entity RegFormCustomers                as projection on DEALER_PORTAL.REGFORM_CUSTOMERS;
  entity MasterRegformFieldsConfig       as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG;
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
  entity RegformBusinessHistory          as projection on  DEALER_PORTAL.REGFORM_BUSINESS_HISTORY;
  entity RegformPromoters                as projection on DEALER_PORTAL.REGFORM_PROMOTERS;
  entity RequestActiveStatus             as projection on DEALER_PORTAL.REQUEST_ACTIVE_STATUS;
  entity RegEventsLog                    as projection on DEALER_PORTAL.REQUEST_EVENTS_LOG;
  entity MasteriDealAttachments           as projection on DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS;
  entity EmailActionlog                   as projection on DEALER_PORTAL.IDEAL_EMAIL_LOG;
  entity EmailConfig                  as projection on DEALER_PORTAL.EMAIL_CONFIG;
  entity MasterAddressType         as projection on DEALER_PORTAL.MASTER_ADDRESS_TYPE;
  entity RegformBankingDetails as projection on DEALER_PORTAL.REGFORM_BANKING_DETAILS;
  entity MasterEntityAndType as projection on DEALER_PORTAL.MASTER_ENTITY_AND_TYPE;
  entity MasterApprovalTypes as projection on DEALER_PORTAL.MASTER_APPROVAL_TYPES;

  type User_Details:{
    USER_ROLE: String(50);
    USER_ID: String(50);
  }

  function checkServiceAvailability(cloudSrv:Boolean,onPremiseSrv:Boolean) returns many String;
  action DistInternalRequest(action : String, stepNo : Integer, comment : String, srNo : Integer, attachCode : Integer, 
  ndaStatus : String, reqHeader : many RequestInfo, addressData : many RegFormAddress, promotersData : many RegformPromoters,
  businessHistoryData : many RegformBusinessHistory, contactsData : many RegFormContacts, bankData : many RegFormBanks,bankingDetails : many RegformBankingDetails, customerData : many RegFormCustomers, attachmentFieldsData : many RegFormAttachFields, attachmentData : many RegFormAttachments, updatedFields : many String, eventsData : many RegEventsLog,supplierLogData : many RegSupplierLog,userDetails:User_Details) returns many String; 

}
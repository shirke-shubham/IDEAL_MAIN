using {DEALER_PORTAL,USERMASTER_ENTITIES} from '../db/MASTER_TABLES';
using {DEALER_PORTAL.REQUEST_INFO,
DEALER_PORTAL.REQUEST_EVENTS_LOG,DEALER_PORTAL.REQUEST_ACTIVE_STATUS,DEALER_PORTAL.MASTER_APPROVAL_TYPES,
DEALER_PORTAL.DEALER_MASTER_S4_HANA,DEALER_PORTAL.REGFORM_ADDRESS,DEALER_PORTAL.REGFORM_BANKS,DEALER_PORTAL.REGFORM_BUSINESS_HISTORY,DEALER_PORTAL.REGFORM_PROMOTERS,DEALER_PORTAL.REGFORM_ATTACH_FIELDS,DEALER_PORTAL.REGFORM_ATTACHMENTS,
DEALER_PORTAL.REGFORM_CONTACTS,DEALER_PORTAL.REGFORM_CUSTOMERS,DEALER_PORTAL.REGFORM_BANKING_DETAILS} from '../db/TRANSACTION_TABLES';

service ideal_request_process_srv {

    entity MasterCountry as projection on DEALER_PORTAL.MASTER_COUNTRY;
    entity MasterApprovalTypes as projection on DEALER_PORTAL.MASTER_APPROVAL_TYPES;
    entity MasterEntityAndType as projection on DEALER_PORTAL.MASTER_ENTITY_AND_TYPE;
    entity MasterRegion as projection on DEALER_PORTAL.MASTER_REGION;
    entity MasterIdealUsers as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
    entity MasterCurrency as projection on DEALER_PORTAL.MASTER_CURRENCY;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity MasterIdealAttachments as projection on DEALER_PORTAL.MASTER_IDEAL_ATTACHMENTS;
    entity MasterStatus as projection on DEALER_PORTAL.MASTER_STATUS;
    entity MasterRequestType as projection on DEALER_PORTAL.MASTER_REQUEST_TYPE;
    entity MasterRequestEvents as projection on DEALER_PORTAL.MASTER_REQUEST_EVENTS;
    entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity RequestEventsLog as projection on DEALER_PORTAL.REQUEST_EVENTS_LOG;
    entity DealerMasterS4Hana as projection on DEALER_PORTAL.DEALER_MASTER_S4_HANA;
    entity MasterUserRole as projection on DEALER_PORTAL.MASTER_USER_ROLE;
    entity MasterUserEntityUsers as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;
    entity UserMasterEntities as projection on USERMASTER_ENTITIES;
    entity RegformAddress as projection on DEALER_PORTAL.REGFORM_ADDRESS;
    entity RegformBanks as projection on DEALER_PORTAL.REGFORM_BANKS;
    entity RegformContacts as projection on DEALER_PORTAL.REGFORM_CONTACTS;
    entity RegformCustomers as projection on DEALER_PORTAL.REGFORM_CUSTOMERS;
    entity RegformBankingDetails as projection on DEALER_PORTAL.REGFORM_BANKING_DETAILS;
    entity RegformBusinessHistory as projection on DEALER_PORTAL.REGFORM_BUSINESS_HISTORY;
    entity RegformPromoters as projection on DEALER_PORTAL.REGFORM_PROMOTERS;
    entity RegformAttachFields as projection on DEALER_PORTAL.REGFORM_ATTACH_FIELDS;
    entity RegformAttachments as projection on DEALER_PORTAL.REGFORM_ATTACHMENTS;
    entity MasterAddressType         as projection on DEALER_PORTAL.MASTER_ADDRESS_TYPE;
    entity MasterRegformFieldsConfig as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_CONFIG;
    entity MasterRegformFieldsUpdated as projection on DEALER_PORTAL.MASTER_REGFORM_FIELDS_UPDATED;
    entity RequestActiveStatus as projection on DEALER_PORTAL.REQUEST_ACTIVE_STATUS;
    entity MasterApprovalHierarchy as projection on DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY;

    type User_Details:{
    USER_ROLE: String(50);
    USER_ID: String(50);
  }

    action RequestProcess(action : String, appType:String, inputData : many RequestInfo, eventsData : many RequestEventsLog,userDetails:User_Details) returns many String;
    action RequestEditProcess(input : String) returns many String;
    

}
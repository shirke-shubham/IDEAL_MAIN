using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_SO_STATUS,DEALER_PORTAL.MASTER_PR_EVENT,DEALER_PORTAL.MASTER_USER_ROLE,DEALER_PORTAL.MASTER_USER_ENTITY_CODES,VIEW_REQUEST_ACTIVE_STATUS,USERMASTER_ENTITIES,
DEALER_PORTAL.MASTER_PR_STATUS,DEALER_PORTAL.MASTER_IDEAL_USERS,DEALER_PORTAL.MASTER_ENTITY_CODE,DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY} from '../db/MASTER_TABLES';

service ideal_purchase_creation_srv {

    entity PrHeader as projection on DEALER_PORTAL.PR_HEADER;
    entity PrItems as projection on DEALER_PORTAL.PR_ITEMS;
    entity SoHeader as projection on DEALER_PORTAL.SO_HEADER;
    entity SoItem as projection on DEALER_PORTAL.SO_ITEMS;
    entity PrEventLog as projection on DEALER_PORTAL.PR_EVENT_LOG;
    entity MasterSoStatus as projection on DEALER_PORTAL.MASTER_SO_STATUS;
    entity MasterPrEvent as projection on DEALER_PORTAL.MASTER_PR_EVENT;
    entity MasterPrStatus as projection on DEALER_PORTAL.MASTER_PR_STATUS;
    entity MasterIdealUsers as projection on DEALER_PORTAL.MASTER_IDEAL_USERS;
    entity UserMasterEntities as projection on USERMASTER_ENTITIES;
    entity MasterUserRole as projection on DEALER_PORTAL.MASTER_USER_ROLE;
    entity MasterUserEntityUsers as projection on DEALER_PORTAL.MASTER_USER_ENTITY_CODES;
    entity MasterEntityCode as projection on DEALER_PORTAL.MASTER_ENTITY_CODE;
    entity PrCart as projection on DEALER_PORTAL.PR_CART;
    entity PrTemplate as projection on DEALER_PORTAL.PR_TEMPLATE;
    // entity RequestInfo as projection on DEALER_PORTAL.REQUEST_INFO;
    entity RequestActiveStatus as projection on DEALER_PORTAL.REQUEST_ACTIVE_STATUS;
    entity ViewRequestActiveStatus as projection on VIEW_REQUEST_ACTIVE_STATUS;
    entity MasterApprovalHierarchy as projection on DEALER_PORTAL.MASTER_APPROVAL_HIERARCHY;
    entity Pr_Status_Master as projection on DEALER_PORTAL.PR_STATUS_MASTER;

    type User_Details : {
        USER_ROLE : String(50);
        USER_ID   : String(50);
    }

    action CreatePurchase(action : String, appType: String,prHeader : many PrHeader, prCart : many PrCart,prItems : many PrItems,prEvent : many PrEventLog, userDetails : User_Details) returns String;
    action CreatePurchaseMDK(action : String, appType: String,prHeader : String, prCart : String,prItems : String,prEvent : String, userDetails : User_Details) returns many String;
    // action CreatePurchaseMDK(action : String, appType: String,prCart : String, userDetails : User_Details) returns many String;
    action templateUpload(prTemplate : many PrTemplate)returns String;
    action templateUploadMDK(prTemplate : String)returns many String;

}
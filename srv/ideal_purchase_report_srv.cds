using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_SO_STATUS,DEALER_PORTAL.MASTER_PR_EVENT,DEALER_PORTAL.MASTER_USER_ROLE,DEALER_PORTAL.MASTER_USER_ENTITY_CODES,VIEW_REQUEST_ACTIVE_STATUS,USERMASTER_ENTITIES,
DEALER_PORTAL.MASTER_PR_STATUS,DEALER_PORTAL.MASTER_IDEAL_USERS,DEALER_PORTAL.MASTER_ENTITY_CODE} from '../db/MASTER_TABLES';

service ideal_purchase_report_srv {

    entity PrHeader as projection on DEALER_PORTAL.PR_HEADER{
    *,
    PR_NO as PR_NUM: String,
    TO_DATE(PR_CREATION_DATE) as LV_PR_CREATION_DATE : Date,
    TO_DATE(LAST_UPDATED_DATE) as LV_LAST_UPDATED_DATE : Date,
    };
    entity PrItems as projection on DEALER_PORTAL.PR_ITEMS{
    *,
    TOTAL_AMOUNT + TAXES_AMOUNT as TOTAL_AMT: String,  
    };
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
    entity RequestActiveStatus as projection on DEALER_PORTAL.REQUEST_ACTIVE_STATUS;
    entity ViewRequestActiveStatus as projection on VIEW_REQUEST_ACTIVE_STATUS;

    define view Dist as
    select from PrHeader distinct {
        key DISTRIBUTOR_NAME
    }where DISTRIBUTOR_NAME !='';
}
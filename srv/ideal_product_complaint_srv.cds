using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_PPR_STATUS,DEALER_PORTAL.MASTER_PPR_EVENT_STATUS} from '../db/MASTER_TABLES';

service ideal_product_complaint_srv {

    entity PprHeader as projection on DEALER_PORTAL.PPR_HEADER;
    entity PprAttachment as projection on DEALER_PORTAL.PPR_ATTACHMENT;
    entity PprEvent as projection on DEALER_PORTAL.PPR_EVENTS;
    entity MasterPPrStatus as projection on DEALER_PORTAL.MASTER_PPR_STATUS;
    entity MasterPPrEventStatus as projection on DEALER_PORTAL.MASTER_PPR_EVENT_STATUS;


    type User_Details : {
        USER_ROLE : String(50);
        USER_ID   : String(50);
    }

    action createProductComplaint(action : String, appType:String, PprHeader : many PprHeader, PprAttachment : many PprAttachment, PprEvent : many PprEvent, userDetails : User_Details) returns String;
}
using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_CLAIM_EVENT,DEALER_PORTAL.MASTER_CLAIM_STATUS,
DEALER_PORTAL.MASTER_CLAIM_TYPE} from '../db/MASTER_TABLES';


service ideal_claim_creation_srv {

    entity ClaimHeader as projection on DEALER_PORTAL.CLAIM_HEADER;
    entity ClaimItems as projection on DEALER_PORTAL.CLAIM_ITEMS;
    entity ClaimAttachments as projection on DEALER_PORTAL.CLAIM_ATTACHMENTS;
    entity ClaimEventLog as projection on DEALER_PORTAL.CLAIM_EVENT_LOG;
    entity MasterClaimStatus as projection on DEALER_PORTAL.MASTER_CLAIM_STATUS;
    entity MasterClaimEvent as projection on DEALER_PORTAL.MASTER_CLAIM_EVENT;
    entity MasterClaimType as projection on DEALER_PORTAL.MASTER_CLAIM_TYPE;

    type User_Details : {
        USER_ROLE : String(50);
        USER_ID   : String(50);
    }

    action CreateClaimReq(action : String, appType: String,crHeader : many ClaimHeader,crItems : many ClaimItems,crAttachments : many ClaimAttachments,crEvent : many ClaimEventLog, userDetails : User_Details) returns String;
}


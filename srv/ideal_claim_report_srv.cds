using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_CLAIM_EVENT,DEALER_PORTAL.MASTER_CLAIM_STATUS,
DEALER_PORTAL.MASTER_CLAIM_TYPE} from '../db/MASTER_TABLES';


service ideal_claim_report_srv {

    entity ClaimHeader as projection on DEALER_PORTAL.CLAIM_HEADER
    {
    *,
    CR_NO as CR_NUM: String, 
    TO_DATE(CREATED_ON) as LV_CR_CREATION_DATE : Date,
    TO_DATE(LAST_UPDATED) as LV_LAST_UPDATED_DATE : Date, 
    };
    entity ClaimItems as projection on DEALER_PORTAL.CLAIM_ITEMS;
    entity ClaimAttachments as projection on DEALER_PORTAL.CLAIM_ATTACHMENTS;
    entity ClaimEventLog as projection on DEALER_PORTAL.CLAIM_EVENT_LOG;
    entity MasterClaimStatus as projection on DEALER_PORTAL.MASTER_CLAIM_STATUS;
    entity MasterClaimEvent as projection on DEALER_PORTAL.MASTER_CLAIM_EVENT;
    entity MasterClaimType as projection on DEALER_PORTAL.MASTER_CLAIM_TYPE;

    define view Dist as
    select from ClaimHeader distinct {
        key DISTRIBUTOR_NAME
    }where DISTRIBUTOR_NAME !='';

}


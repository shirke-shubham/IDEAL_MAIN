using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_PAYMENT_EVENT,DEALER_PORTAL.MASTER_PAYMENT_STATUS, DEALER_PORTAL.MASTER_PR_STATUS,
DEALER_PORTAL.MASTER_PR_EVENT} from '../db/MASTER_TABLES';

service ideal_payments_report_srv {

    entity PaymentsHeader as projection on DEALER_PORTAL.PAYMENTS_HEADER{
    *,
    POP_NO as POP_NUM: String,  
    TO_DATE(CREATION_DATE) as LV_PR_CREATION_DATE : Date,
    TO_DATE(LAST_UPDATED_DATE) as LV_LAST_UPDATED_DATE : Date,
    case when  OFFLINE_FP_UTR != '' OR OFFLINE_FP_UTR != null then false else true end as FULL_PAYMENT : Boolean,
    case when  OFFLINE_PP_UTR != '' OR OFFLINE_PP_UTR != null then false else true end as PARTIAL_PAYMENT : Boolean,
    case when  PDC_NO != null then false else true end as POST_DATE_CHEQUES : Boolean,
    };
    entity PaymentsAttachments as projection on DEALER_PORTAL.PAYMENTS_ATTACHMENTS;
    entity PaymentsEventLog as projection on DEALER_PORTAL.PAYMENTS_EVENT_LOG;
    entity MasterPaymentEvent as projection on DEALER_PORTAL.MASTER_PAYMENT_EVENT;
    entity MasterPaymentStatus as projection on DEALER_PORTAL.MASTER_PAYMENT_STATUS;
    entity PrHeader as projection on DEALER_PORTAL.PR_HEADER;
    entity MasterPrStatus as projection on DEALER_PORTAL.MASTER_PR_STATUS;
    entity MasterPrEvent as projection on DEALER_PORTAL.MASTER_PR_EVENT;

    define view Dist as
    select from PaymentsHeader distinct {
        key DISTRIBUTOR_NAME
    }where DISTRIBUTOR_NAME !='';

}
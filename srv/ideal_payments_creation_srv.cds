using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.MASTER_PAYMENT_EVENT,DEALER_PORTAL.MASTER_PAYMENT_STATUS, DEALER_PORTAL.MASTER_PR_STATUS,
DEALER_PORTAL.MASTER_PR_EVENT} from '../db/MASTER_TABLES';

service ideal_payments_creation_srv {

    entity PaymentsHeader as projection on DEALER_PORTAL.PAYMENTS_HEADER;
    entity PaymentsAttachments as projection on DEALER_PORTAL.PAYMENTS_ATTACHMENTS;
    entity PaymentsEventLog as projection on DEALER_PORTAL.PAYMENTS_EVENT_LOG;
    entity MasterPaymentEvent as projection on DEALER_PORTAL.MASTER_PAYMENT_EVENT;
    entity MasterPaymentStatus as projection on DEALER_PORTAL.MASTER_PAYMENT_STATUS;
    entity PrHeader as projection on DEALER_PORTAL.PR_HEADER;
    entity MasterPrStatus as projection on DEALER_PORTAL.MASTER_PR_STATUS;
    entity MasterPrEvent as projection on DEALER_PORTAL.MASTER_PR_EVENT;


    type User_Details : {
        USER_ROLE : String(50);
        USER_ID   : String(50);
    }

    action createPayment(action : String, appType:String, paymentsHeader : many PaymentsHeader, paymentsAttachments : many PaymentsAttachments, paymentsEventLog : many PaymentsEventLog, userDetails : User_Details) returns String;
}
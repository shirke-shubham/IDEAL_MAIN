using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';
using {DEALER_PORTAL.PAYMENT_ENTRY_STATUS_MASTER} from '../db/MASTER_TABLES';

 
service RETAILER_PAYMENT {

   entity Retailer_Payments as projection on DEALER_PORTAL.RETAILER_PAYMENTS;
   entity Retailer_Payment_Event_Logs as projection on DEALER_PORTAL.RETAILER_PAYMENT_EVENT_LOGS;

   entity Payment_Status_Master  as projection on PAYMENT_ENTRY_STATUS_MASTER;


   action retailerPayments( action : String, appType : String, retailerPayment : many Retailer_Payments, paymentEvent : many Retailer_Payment_Event_Logs ) returns String;

}   
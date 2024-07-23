using { DEALER_PORTAL } from '../db/TRANSACTION_TABLES';
  
service ideal_collection_report {

   @Capabilities : {
   FilterRestrictions : {
      FilterExpressionRestrictions :
         [{
            Property : 'DEPOSIT_DATE',    
            AllowedExpressions : 'SingleRange'          
         }]
      }
    }
    entity RetailerPayments as projection on DEALER_PORTAL.RETAILER_PAYMENTS;
   
    define view Retailers as
    select from RetailerPayments distinct {
        key RETAILER_NAME
    }where RETAILER_NAME !='';
 
}
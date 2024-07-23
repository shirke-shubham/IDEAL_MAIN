using {DEALER_PORTAL} from '../db/TRANSACTION_TABLES';


service IDEAL_CREDIT_DEBIT_TX {

      entity Credit_Debit_Tx   as projection on DEALER_PORTAL.CREDIT_DEBIT_TRANSACTION;

      action creditDebitTransaction( appType : String, creditDebitTx : many Credit_Debit_Tx ) returns String;

}

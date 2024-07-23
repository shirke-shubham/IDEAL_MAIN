using ZIBS_DMS_PAYMENT_SRV from './external/ZIBS_DMS_PAYMENT_SRV.cds';

service ZIBS_DMS_PAYMENT_SRVSampleService {
    @readonly
    entity PaymentSet as projection on ZIBS_DMS_PAYMENT_SRV.PaymentSet
    {        key Kunnr, Vbeln, Belnr, Payamt, Utrno     }    
;
    @readonly
    entity SORELEASESet as projection on ZIBS_DMS_PAYMENT_SRV.SORELEASESet
    {        key Vbeln     }    
;
}
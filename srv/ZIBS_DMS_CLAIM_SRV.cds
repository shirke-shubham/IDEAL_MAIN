using ZIBS_DMS_CLAIM_SRV from './external/ZIBS_DMS_CLAIM_SRV.cds';

service ZIBS_DMS_CLAIM_SRVSampleService {
    @readonly
    entity INVOICEITEMSet as projection on ZIBS_DMS_CLAIM_SRV.INVOICEITEMSet
    {        key Vbeln, Posnr, Matnr, Arktx, Fkimg, Meins, Fkdat, Netwr, Charg, Vfdat, Rate, Division, Subdivision     }    
;
    @readonly
    entity CLMITEMSet as projection on ZIBS_DMS_CLAIM_SRV.CLMITEMSet
    {        key CrNo, ItemNo, InvoiceNo, ItemCode, InvoiceDate, ReqQuantity, ReqAmount, ReqRate     }    
;
    @readonly
    entity INVOICEF4Set as projection on ZIBS_DMS_CLAIM_SRV.INVOICEF4Set
    {        key Kunnr, Vbeln, Fkdat, Netwr, Mwsbk, Svbeln, Prno     }    
;
    @readonly
    entity CLMHEADERSet as projection on ZIBS_DMS_CLAIM_SRV.CLMHEADERSet
    {        key CrNo, DistributorId, SapCreditNote     }    
;
}
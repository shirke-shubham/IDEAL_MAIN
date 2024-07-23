using ZIBS_DMS_RGA_SRV from './external/ZIBS_DMS_RGA_SRV.cds';

service ZIBS_DMS_RGA_SRVSampleService {
    @readonly
    entity INVOICEF4Set as projection on ZIBS_DMS_RGA_SRV.INVOICEF4Set
    {        key Kunnr, Vbeln, Fkdat, Netwr, Mwsbk, Svbeln, Prno     }    
;
    @readonly
    entity INVOICEITEMSet as projection on ZIBS_DMS_RGA_SRV.INVOICEITEMSet
    {        key Vbeln, Posnr, Matnr, Arktx, Fkimg, Meins, Fkdat, Netwr, Charg, Vfdat, Rate, Division, Subdivision     }    
;
    @readonly
    entity RGAHEADERSet as projection on ZIBS_DMS_RGA_SRV.RGAHEADERSet
    {        key RgaNo, DistributorId, Reason, SalesOrder     }    
;
    @readonly
    entity RGAITEMSet as projection on ZIBS_DMS_RGA_SRV.RGAITEMSet
    {        key RgaNo, key RgaItemNo, Matnr, Batch, Quantity, Price, RetQuantity, Vbeln, Division, Subdivision     }    
;
}
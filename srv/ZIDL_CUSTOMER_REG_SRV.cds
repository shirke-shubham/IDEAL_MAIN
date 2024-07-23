using ZIDL_CUSTOMER_REG_SRV from './external/ZIDL_CUSTOMER_REG_SRV.cds';

service ZIDL_CUSTOMER_REG_SRVSampleService {
    @readonly
    entity GetTelCodeSet as projection on ZIDL_CUSTOMER_REG_SRV.GetTelCodeSet
    {        key Land1, Telefto     }    
;
    @readonly
    entity GetStateSet as projection on ZIDL_CUSTOMER_REG_SRV.GetStateSet
    {        key Land1, key Bland, Bezei     }    
;
    @readonly
    entity GetSwiftCodeSet as projection on ZIDL_CUSTOMER_REG_SRV.GetSwiftCodeSet
    {        key Banks, key Swift     }    
;
    @readonly
    entity GetSortkeySet as projection on ZIDL_CUSTOMER_REG_SRV.GetSortkeySet
    {        key Zuawa, Ttext     }    
;
    @readonly
    entity GetSchemaGrpSet as projection on ZIDL_CUSTOMER_REG_SRV.GetSchemaGrpSet
    {        key Kalsk, Kalsb     }    
;
    @readonly
    entity GetPurOrgSet as projection on ZIDL_CUSTOMER_REG_SRV.GetPurOrgSet
    {        key Ekorg, Ekotx     }    
;
    @readonly
    entity GetPaymentMethodSet as projection on ZIDL_CUSTOMER_REG_SRV.GetPaymentMethodSet
    {        key Land1, key Zlsch, Text2     }    
;
    @readonly
    entity GetPaymentTermSet as projection on ZIDL_CUSTOMER_REG_SRV.GetPaymentTermSet
    {        key Zterm, ZtermT     }    
;
    @readonly
    entity GetMaterialGrpSet as projection on ZIDL_CUSTOMER_REG_SRV.GetMaterialGrpSet
    {        key Matkl, Wgbez     }    
;
    @readonly
    entity GetCurrencyKeySet as projection on ZIDL_CUSTOMER_REG_SRV.GetCurrencyKeySet
    {        key Waers, Ltext     }    
;
    @readonly
    entity GetCustomersSet as projection on ZIDL_CUSTOMER_REG_SRV.GetCustomersSet
    {        key Bukrs, key Kunnr, Name1     }    
;
    @readonly
    entity GetGLReconAccSet as projection on ZIDL_CUSTOMER_REG_SRV.GetGLReconAccSet
    {        Saknr, Txt50, key Spras, key Ktopl     }    
;
    @readonly
    entity GetIncotermSet as projection on ZIDL_CUSTOMER_REG_SRV.GetIncotermSet
    {        key Inco1, Bezei     }    
;
    @readonly
    entity GetCountrySet as projection on ZIDL_CUSTOMER_REG_SRV.GetCountrySet
    {        key Land1, Landx, Natio     }    
;
    @readonly
    entity GetCountryDetailSet as projection on ZIDL_CUSTOMER_REG_SRV.GetCountryDetailSet
    {        key Land1, Landk, Lnplz, Prplz, Addrs, Xplzs, Xplpf, Spras, Xland, Xaddr, Nmfmt, Xregs, Xplst, Intca, Intca3, Intcn3, Xegld, Xskfn, Xmwsn, Lnbkn, Prbkn, Lnblz, Prblz, Lnpsk, Prpsk, Xprbk, Bnkey, Lnbks, Prbks, Xprso, Pruin, Uinln, Lnst1, Prst1, Lnst2, Prst2, Lnst3, Prst3, Lnst4, Prst4, Lnst5, Prst5, Landd, Kalsm, Landa, Wechf, Lkvrz, Intcn, Xdezp, Datfm, Curin, Curha, Waers, Kurst, Afapl, Gwgwrt, Umrwrt, Kzrbwb, Xanzum, Ctnconcept, Kzsrv, Xxinve, Xgccv, Sureg     }    
;
    @readonly
    entity GetCompanyCodeSet as projection on ZIDL_CUSTOMER_REG_SRV.GetCompanyCodeSet
    {        key Bukrs, Butxt, Ort01, Waers     }    
;
    @readonly
    entity GetCitySet as projection on ZIDL_CUSTOMER_REG_SRV.GetCitySet
    {        key Land1, Landx, key Regio, Bezer, Cityc, Bezei     }    
;
    @readonly
    entity CheckUpdateReqSet as projection on ZIDL_CUSTOMER_REG_SRV.CheckUpdateReqSet
    {        key RequestNo, Status     }    
;
    @readonly
    entity GetAccountGrpSet as projection on ZIDL_CUSTOMER_REG_SRV.GetAccountGrpSet
    {        key Ktokk, Numkr, Xcpds, Txt30     }    
;
    @readonly
    entity GetBankDetailSet as projection on ZIDL_CUSTOMER_REG_SRV.GetBankDetailSet
    {        key Bukrs, key Hbkid, Banks, Bankl, Banka, Ort01, Swift, Bnklz, Brnch     }    
;
    @readonly
    entity CheckNewCustomerCodeSet as projection on ZIDL_CUSTOMER_REG_SRV.CheckNewCustomerCodeSet
    {        key Kunnr, Status     }    
;
    @readonly
    entity CheckCustomerCodeSet as projection on ZIDL_CUSTOMER_REG_SRV.CheckCustomerCodeSet
    {        key Kunnr, Status     }    
;
    @readonly
    entity BPTypeSet as projection on ZIDL_CUSTOMER_REG_SRV.BPTypeSet
    {        key Spras, key Bpkind, Text40     }    
;
}
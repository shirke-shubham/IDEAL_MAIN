using ZMDG_CUSTOMER_REG_SRV from './external/ZMDG_CUSTOMER_REG_SRV.cds';

service ZMDG_CUSTOMER_REG_SRVSampleService {
    @readonly
    entity BankDetailsSet as projection on ZMDG_CUSTOMER_REG_SRV.BankDetailsSet
    {        key Kunnr, key BankID, Banks, IBAN, Bankl, Bankn, Bkont, Xezer, Bkref, Koinh, EbppAccname     }    
;
    @readonly
    entity CompanyDataSet as projection on ZMDG_CUSTOMER_REG_SRV.CompanyDataSet
    {        key Kunnr, key Bukrs     }    
;
    @readonly
    entity ContactPersonSet as projection on ZMDG_CUSTOMER_REG_SRV.ContactPersonSet
    {        key PartnerID, Name1, Designation, Name2, Street, HouseNum1, City1, Country, State, PoBox, PostalCode, TelephoneNumber, Mobile, EmailID, key Kunnr     }    
;
    @readonly
    entity GeneralDataSet as projection on ZMDG_CUSTOMER_REG_SRV.GeneralDataSet
    {        REPRF, ZTERM, ZUAWA, AKONT, Land1, Name1, Name2, Ort01, Ort02, Pfach, Pstlz, Regio, Sortl, Stras, STR_SUPPL1, STR_SUPPL2, STR_SUPPL3, Anred, HouseNum, Telephone1, Telephone2, Mobile1, Mobile2, Fax1, Fax2, Email1, Email2, Sperr, Sperm, Partner, Type, Idnumber, Scenario, BP_Type, VAT_RegNo, ChangeRequest, key Kunnr     }    
;
    @readonly
    entity IdentificationSet as projection on ZMDG_CUSTOMER_REG_SRV.IdentificationSet
    {        key Partner, Type, Idnumber     }    
;
}
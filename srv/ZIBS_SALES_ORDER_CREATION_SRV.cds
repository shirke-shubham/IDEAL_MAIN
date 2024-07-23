using ZIBS_SALES_ORDER_CREATION_SRV from './external/ZIBS_SALES_ORDER_CREATION_SRV.cds';

service ZIBS_SALES_ORDER_CREATION_SRVSampleService {
    @readonly
    entity CustomerHelpSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.CustomerHelpSet
    {        key KUNNR, NAME1     }    
;
    @readonly
    entity FavoriteMaterialSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.FavoriteMaterialSet
    {        MaterialCode, MaterialDes, NetPrice, Amount, Vat, TotalAmt, key MaterialGroup, ImageUrl, FavoriteCount     }    
;
    @readonly
    entity HEADSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.HEADSet
    {        key SoNumber     }    
;
    @readonly
    entity MaterialGroupsSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.MaterialGroupsSet
    {        key MaterialGroup, MaterialGroupDes, MaterialCount     }    
;
    @readonly
    entity MaterialsSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.MaterialsSet
    {        key MaterialCode, MaterialDes, NetPrice, Amount, Vat, TotalAmt, key MaterialGroup, ImageUrl, FavoriteCount     }    
;
    @readonly
    entity SOHeaderSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.SOHeaderSet
    {        key SoNumber, CustomerCode, CustomerName, Status, SoCreation, ShipTo, BuCode, OrderType, PaymentMethod, RegionCode, LastUpdate, BillTo, OrderNo     }    
;
    @readonly
    entity SHIPTOSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.SHIPTOSet
    {        key Kunnr, Kunag, Name1     }    
;
    @readonly
    entity SOItemSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.SOItemSet
    {        key SoNumber, key SoItem, OrderNo, HsnCode, MatCode, ShippingMode, Quantity, ApprovedQty, FocQty, Rate, TaxPercent, Cgst, Sgst, Igst, InitDiscount, TaxAmount, TotalAmount, ProductHierarchy, Uom, Subdivision     }    
;
    @readonly
    entity SalesHeaderSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.SalesHeaderSet
    {        key Salesorder, Salesordertype, Salesordertypename, Division1, Companycode, Customer1, Companycodename, Salesprocessingstatus, Salesorganization, Salesoffice, Salesorganizationname, Salesofficename, Distributionchannel, Distributionchannelname, Divisionname, Customername, Salesgroup, Salesgroupname, Salesorderdate, Documentcurrency, Salesordernetamount, Salesorderstatus, Createdbyuser     }    
;
    @readonly
    entity STOCKSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.STOCKSet
    {        key Matnr, Stock     }    
;
    @readonly
    entity SalesItemSet as projection on ZIBS_SALES_ORDER_CREATION_SRV.SalesItemSet
    {        key Salesorder, Effectiveamount, key Salesorderitem, Salesorderitemuniqueid, Salesorderitemcategory, Salesorditemcategoryname, Material, Manufacturermaterial, Salesorderitemtext, Materialgroup, Plant, Orderquantity, Netpriceamount, Netpricequantity, Netamount, Producttype, Producttypename, Documentcurrency, Orderpriceunit, Salesorderquantityunit, Taxcode, Salesorganization, Customer, Taxcalculationprocedure, Country, Companycode, Itemweightunit, Baseunit, Region, Postalcode, Cityname, ImageUrl, Distributionchannel, Division     }    
;
}
/* checksum : cbcef1934b589f439d241a647f7004e9 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZIBS_DMS_PAYMENT_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIBS_DMS_PAYMENT_SRV.PaymentSet {
  @sap.unicode : 'false'
  @sap.label : 'Customer'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Kunnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'SD Document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vbeln : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Document Number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Belnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Amount'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Payamt : Decimal(24, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Doc.Header Text'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Utrno : String(25) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIBS_DMS_PAYMENT_SRV.SORELEASESet {
  @sap.unicode : 'false'
  @sap.label : 'Sales Document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Vbeln : String(10) not null;
};


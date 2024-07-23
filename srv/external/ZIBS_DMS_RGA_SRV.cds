/* checksum : 0bfa94bca0d3ddd25749dd4004ba9613 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZIBS_DMS_RGA_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIBS_DMS_RGA_SRV.INVOICEF4Set {
  @sap.unicode : 'false'
  @sap.label : 'Customer'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Kunnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Sales document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vbeln : String(10) not null;
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Billing Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Fkdat : Timestamp not null;
  @sap.unicode : 'false'
  @sap.label : 'Net Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Netwr : Decimal(16, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Tax Amount'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Mwsbk : Decimal(14, 3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Sales document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Svbeln : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Cust. Reference'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Prno : String(20) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIBS_DMS_RGA_SRV.INVOICEITEMSet {
  @sap.unicode : 'false'
  @sap.label : 'Sales document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Vbeln : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Posnr : String(6);
  @sap.unicode : 'false'
  @sap.label : 'Material'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Matnr : String(40);
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Arktx : String(40);
  @sap.unicode : 'false'
  @sap.label : 'Billed qty'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Fkimg : Decimal(13, 3);
  @sap.unicode : 'false'
  @sap.label : 'Base Unit'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'unit-of-measure'
  Meins : String(3);
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'Billing Date'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Fkdat : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Net Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Netwr : Decimal(16, 3);
  @sap.unicode : 'false'
  @sap.label : 'Batch'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Charg : String(10);
  @odata.Type : 'Edm.DateTime'
  @odata.Precision : 7
  @sap.unicode : 'false'
  @sap.label : 'SLED/BBD'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vfdat : Timestamp;
  @sap.unicode : 'false'
  @sap.label : 'Net Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Rate : Decimal(16, 3);
  @sap.unicode : 'false'
  @sap.label : 'Division'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Division : String(50);
  @sap.unicode : 'false'
  @sap.label : 'Sub Division'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Subdivision : String(50);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIBS_DMS_RGA_SRV.RGAHEADERSet {
  @sap.unicode : 'false'
  @sap.label : 'Character Field with Length 10'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key RgaNo : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Customer'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  DistributorId : String(10);
  @sap.unicode : 'false'
  @sap.label : 'Character 100'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Reason : String(100);
  @sap.unicode : 'false'
  @sap.label : 'Sales document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  SalesOrder : String(10);
  @cds.ambiguous : 'missing on condition?'
  RGAHEADTOITEM : Association to many ZIBS_DMS_RGA_SRV.RGAITEMSet on RGAHEADTOITEM.RgaNo = RgaNo;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZIBS_DMS_RGA_SRV.RGAITEMSet {
  @sap.unicode : 'false'
  @sap.label : 'Character Field with Length 10'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key RgaNo : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Item'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key RgaItemNo : String(6) not null;
  @sap.unicode : 'false'
  @sap.label : 'Material'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Matnr : String(40);
  @sap.unicode : 'false'
  @sap.label : 'Batch'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Batch : String(10);
  @sap.unicode : 'false'
  @sap.label : 'Billed qty'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Quantity : Decimal(13, 3);
  @sap.unicode : 'false'
  @sap.label : 'Net Value'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Price : Decimal(16, 3);
  @sap.unicode : 'false'
  @sap.label : 'Billed qty'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  RetQuantity : Decimal(13, 3);
  @sap.unicode : 'false'
  @sap.label : 'Sales document'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Vbeln : String(10);
  @sap.unicode : 'false'
  @sap.label : 'Division'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Division : String(50);
  @sap.unicode : 'false'
  @sap.label : 'Sub Division'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Subdivision : String(50);
};


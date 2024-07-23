const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const ZIBS_SALES_ORDER_CREATION_SRV = await cds.connect.to("ZIBS_SALES_ORDER_CREATION_SRV"); 
      srv.on('READ', 'CustomerHelpSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'FavoriteMaterialSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'HEADSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'MaterialGroupsSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'MaterialsSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'SOHeaderSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'SHIPTOSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'SOItemSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'SalesHeaderSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'STOCKSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
      srv.on('READ', 'SalesItemSet', req => ZIBS_SALES_ORDER_CREATION_SRV.run(req.query)); 
}
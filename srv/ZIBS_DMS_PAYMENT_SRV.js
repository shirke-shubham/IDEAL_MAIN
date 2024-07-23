const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const ZIBS_DMS_PAYMENT_SRV = await cds.connect.to("ZIBS_DMS_PAYMENT_SRV"); 
      srv.on('READ', 'PaymentSet', req => ZIBS_DMS_PAYMENT_SRV.run(req.query)); 
      srv.on('READ', 'SORELEASESet', req => ZIBS_DMS_PAYMENT_SRV.run(req.query)); 
}